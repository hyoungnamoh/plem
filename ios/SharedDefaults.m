//
//  SharedDefaults.m
//  Plem
//
//  Created by 오형남 on 6/13/24.
//

#import <Foundation/Foundation.h>
#import "SharedDefaults.h"
#import "Plem-Swift.h"


@implementation SharedDefaults

-(dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(SharedDefaults);

RCT_EXPORT_METHOD(updateDoItNow:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try{
    [WidgetUpdater reloadWidget];
    resolve(@"true");
  }@catch(NSException *exception){
    reject(@"get_error",exception.reason, nil);
  }

}

RCT_EXPORT_METHOD(setToken:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try{
    NSUserDefaults *shared = [[NSUserDefaults alloc]initWithSuiteName:@"group.com.plem.widget.do-it-now"];
    [shared setObject:data forKey:@"token"];
    [shared synchronize];
        
    resolve(@"true");
  }@catch(NSException *exception){
    reject(@"get_error",exception.reason, nil);
  }

}

@end
