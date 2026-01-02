import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:namaz_masjid_nearbyme/main.dart';

void main() {
  testWidgets('App starts and shows title', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that the app title is displayed.
    expect(find.text('Namaz Masjid Nearby'), findsOneWidget);
  });
}
