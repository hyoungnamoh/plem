//
//  Header.h
//  ExampleExtension
//
//  Created by 오형남 on 6/9/24.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface SharedDefaults : NSObject<RCTBridgeModule>

@end
