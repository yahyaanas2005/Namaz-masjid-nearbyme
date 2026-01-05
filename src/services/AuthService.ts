import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { User } from '@models/User';
import { CONFIG } from '@constants/index';

class AuthService {
  constructor() {
    this.configureGoogleSignIn();
  }

  private configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get user info from Google
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with Firebase using the Google credential
      const userCredential = await auth().signInWithCredential(googleCredential);

      return this.mapFirebaseUserToUser(userCredential.user, 'google');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<User> {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Failed to get access token');
      }

      // Create a Firebase credential with the access token
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign in with Firebase using the Facebook credential
      const userCredential = await auth().signInWithCredential(facebookCredential);

      return this.mapFirebaseUserToUser(userCredential.user, 'facebook');
    } catch (error: any) {
      console.error('Facebook Sign-In Error:', error);
      throw new Error(error.message || 'Failed to sign in with Facebook');
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      // Sign out from Firebase
      await auth().signOut();

      // Sign out from Google if signed in
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut();
      }

      // Facebook logout
      LoginManager.logOut();
    } catch (error: any) {
      console.error('Sign-Out Error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth().currentUser;
    if (!firebaseUser) {
      return null;
    }

    const provider = firebaseUser.providerData[0]?.providerId.includes('google')
      ? 'google'
      : 'facebook';

    return this.mapFirebaseUserToUser(firebaseUser, provider);
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged(firebaseUser => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      const provider = firebaseUser.providerData[0]?.providerId.includes('google')
        ? 'google'
        : 'facebook';

      callback(this.mapFirebaseUserToUser(firebaseUser, provider));
    });
  }

  /**
   * Map Firebase user to app User model
   */
  private mapFirebaseUserToUser(firebaseUser: any, authProvider: 'google' | 'facebook'): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL,
      authProvider,
      createdAt: firebaseUser.metadata.creationTime
        ? new Date(firebaseUser.metadata.creationTime)
        : new Date(),
      lastLogin: firebaseUser.metadata.lastSignInTime
        ? new Date(firebaseUser.metadata.lastSignInTime)
        : new Date(),
    };
  }
}

export default new AuthService();
