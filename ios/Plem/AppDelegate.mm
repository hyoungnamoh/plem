#import "AppDelegate.h"
#import "RNSplashScreen.h"  // here

#import <React/RCTBundleURLProvider.h>

// firebase fcm
#import <Firebase.h> 
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

// codepush
#import <CodePush/CodePush.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>

/**
 Deletes all Keychain items accessible by this app if this is the first time the user launches the app
 */
static void ClearKeychainIfNecessary() {
    // Checks wether or not this is the first time the app is run
    if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
        // Set the appropriate value so we don't clear next time the app is launched
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];

        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];

        // Maps through all Keychain classes and deletes all items that match
        for (id secItemClass in secItemClasses) {
            NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
            SecItemDelete((__bridge CFDictionaryRef)spec);
        }
    }
}

@implementation AppDelegate
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  ClearKeychainIfNecessary();
  self.moduleName = @"plem";
  // // You can add your custom initial props in the dictionary below.
  // // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  // // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];

  return YES;
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}

@end
