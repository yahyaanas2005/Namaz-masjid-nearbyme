import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Namaz Masjid Nearby',
      theme: ThemeData(
        primarySwatch: Colors.green,
        useMaterial3: true,
      ),
      home: const MapScreen(),
    );
  }
}

class Masjid {
  final String name;
  final double lat;
  final double lon;
  final double distance;

  Masjid({
    required this.name,
    required this.lat,
    required this.lon,
    required this.distance,
  });
}

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  LatLng _currentLocation = const LatLng(51.5074, -0.1278); // Default: London
  List<Masjid> _masjids = [];
  bool _isLoading = false;
  String _statusMessage = 'Getting location...';
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    _initializeLocation();
  }

  Future<void> _initializeLocation() async {
    setState(() {
      _isLoading = true;
      _statusMessage = 'Checking location permissions...';
    });

    try {
      // Check and request location permissions
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() {
          _statusMessage = 'Location services disabled';
          _isLoading = false;
        });
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() {
            _statusMessage = 'Location permission denied';
            _isLoading = false;
          });
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        setState(() {
          _statusMessage = 'Location permission permanently denied';
          _isLoading = false;
        });
        return;
      }

      setState(() {
        _statusMessage = 'Getting current location...';
      });

      // Get current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _currentLocation = LatLng(position.latitude, position.longitude);
        _statusMessage = 'Finding nearby masjids...';
      });

      // Move map to current location
      _mapController.move(_currentLocation, 14.0);

      // Fetch nearby masjids
      await _fetchNearbyMasjids();
    } catch (e) {
      setState(() {
        _statusMessage = 'Error: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchNearbyMasjids() async {
    try {
      // Overpass API query for masjids within 3000m
      final query = '''
[out:json];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:3000,${_currentLocation.latitude},${_currentLocation.longitude});
);
out body;
''';

      final response = await http.post(
        Uri.parse('https://overpass-api.de/api/interpreter'),
        body: query,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final elements = data['elements'] as List;

        List<Masjid> masjids = [];
        for (var element in elements) {
          final lat = element['lat'] as double;
          final lon = element['lon'] as double;
          final name = element['tags']?['name'] ?? 'Unnamed Masjid';

          // Calculate distance
          final distance = Geolocator.distanceBetween(
            _currentLocation.latitude,
            _currentLocation.longitude,
            lat,
            lon,
          );

          masjids.add(Masjid(
            name: name,
            lat: lat,
            lon: lon,
            distance: distance,
          ));
        }

        // Sort by distance
        masjids.sort((a, b) => a.distance.compareTo(b.distance));

        setState(() {
          _masjids = masjids;
          _isLoading = false;
          _statusMessage = 'Found ${masjids.length} masjids nearby';
        });
      } else {
        setState(() {
          _statusMessage = 'Failed to fetch masjids';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _statusMessage = 'Error fetching masjids: $e';
        _isLoading = false;
      });
    }
  }

  Future<Map<String, dynamic>?> _fetchPrayerTimings() async {
    try {
      final now = DateTime.now();
      final dateStr = DateFormat('dd-MM-yyyy').format(now);
      
      final url = Uri.parse(
        'http://api.aladhan.com/v1/timings/$dateStr'
        '?latitude=${_currentLocation.latitude}'
        '&longitude=${_currentLocation.longitude}'
        '&method=2',
      );

      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['data']['timings'];
      }
    } catch (e) {
      debugPrint('Error fetching prayer timings: $e');
    }
    return null;
  }

  void _showPrayerTimings(Masjid masjid) async {
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    final timings = await _fetchPrayerTimings();
    
    if (!mounted) return;
    Navigator.pop(context); // Close loading dialog

    if (timings == null) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: const Text('Failed to fetch prayer timings'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(masjid.name),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Distance: ${(masjid.distance / 1000).toStringAsFixed(2)} km'),
              const SizedBox(height: 16),
              const Text(
                'Prayer Timings',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              _buildTimingRow('Fajr', timings['Fajr']),
              _buildTimingRow('Sunrise', timings['Sunrise']),
              _buildTimingRow('Dhuhr', timings['Dhuhr']),
              _buildTimingRow('Asr', timings['Asr']),
              _buildTimingRow('Maghrib', timings['Maghrib']),
              _buildTimingRow('Isha', timings['Isha']),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildTimingRow(String prayer, String? time) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(prayer, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(time ?? 'N/A'),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Namaz Masjid Nearby'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _initializeLocation,
          ),
        ],
      ),
      body: Column(
        children: [
          // Status bar
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(8),
            color: _isLoading ? Colors.orange[100] : Colors.green[100],
            child: Text(
              _statusMessage,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          // Map
          Expanded(
            flex: 2,
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: _currentLocation,
                initialZoom: 14.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.namaz_masjid_nearbyme',
                ),
                MarkerLayer(
                  markers: [
                    // User location marker
                    Marker(
                      point: _currentLocation,
                      width: 40,
                      height: 40,
                      child: const Icon(
                        Icons.my_location,
                        color: Colors.blue,
                        size: 40,
                      ),
                    ),
                    // Masjid markers
                    ..._masjids.map((masjid) => Marker(
                          point: LatLng(masjid.lat, masjid.lon),
                          width: 40,
                          height: 40,
                          child: GestureDetector(
                            onTap: () => _showPrayerTimings(masjid),
                            child: const Icon(
                              Icons.mosque,
                              color: Colors.green,
                              size: 40,
                            ),
                          ),
                        )),
                  ],
                ),
              ],
            ),
          ),
          // Masjid list
          Expanded(
            flex: 1,
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _masjids.isEmpty
                    ? const Center(child: Text('No masjids found nearby'))
                    : ListView.builder(
                        itemCount: _masjids.length,
                        itemBuilder: (context, index) {
                          final masjid = _masjids[index];
                          return ListTile(
                            leading: const Icon(Icons.mosque, color: Colors.green),
                            title: Text(masjid.name),
                            subtitle: Text(
                              'Distance: ${(masjid.distance / 1000).toStringAsFixed(2)} km',
                            ),
                            onTap: () => _showPrayerTimings(masjid),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
