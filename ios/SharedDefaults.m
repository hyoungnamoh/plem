//
//  SharedDefaults.m
//  ExampleExtension
//
//  Created by 오형남 on 6/9/24.
//

#import <Foundation/Foundation.h>
#import "Header.h"

@implementation SharedDefaults

-(dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(SharedDefaults);

RCT_EXPORT_METHOD(set:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try{
    NSUserDefaults *shared = [[NSUserDefaults alloc]initWithSuiteName:@"group.react.native.widget.example"]; //App Group명
    [shared setObject:data forKey:@"data"]; // data를 저장할 key 값
    [shared synchronize];
    resolve(@"true");
  }@catch(NSException *exception){
    reject(@"get_error",exception.reason, nil);
  }

}

@end
