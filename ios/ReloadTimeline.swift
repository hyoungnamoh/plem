//
//  ReloadTimeline.swift
//  Plem
//
//  Created by 오형남 on 6/15/24.
//

import Foundation
import WidgetKit

@objc class WidgetUpdater: NSObject {
    @objc static func reloadWidget() {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "DoItNow")
        }
    }
}
