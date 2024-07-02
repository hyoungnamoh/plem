//
//  DoItNow.swift
//  DoItNow
//
//  Created by 오형남 on 6/13/24.
//


import WidgetKit
import SwiftUI

extension View {
  func widgetBackground() -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      return containerBackground(for: .widget){}
    } else {
      return background()
    }
  }
}

// Plan과 SubPlan 모델 정의
//public struct PlanModel: Codable, Identifiable {
//    public let id: Int
//    public let name: String
//    public let startHour: Int
//    public let startMin: Int
//    public let endHour: Int
//    public let endMin: Int
//    public let removed_at: String?
//    public var subPlans: [SubPlanModel]
//}

public struct SubPlanModel: Codable, Identifiable {
    public let PlanId: Int
    public let createdAt: String
    public let id: Int
    public let name: String
    public let removed_at: String?
    public let updatedAt: String
    public let isCompleted: Bool
}

public struct DoItNowResponseModel: Codable {
  public let data: DoItNowDataModel
  public let status: Int
  public let success: Bool
}

public struct DoItNowDataModel: Codable {
  public let nowPlan: PlanModel?
  public let nowPlanIndex: Int
}

public struct PlanModel: Codable, Identifiable {
  public let id: Int
  public let name: String
  public let startHour: Int
  public let startMin: Int
  public let endHour: Int
  public let endMin: Int
  public let removed_at: String?
  public let PlanChartId: Int
  public let createdAt: String
  public let notification: String?
  public let tempId: String
  public let updatedAt: String
  public var subPlans: [SubPlanModel]
}


let samplePlan = PlanModel(
    id: 325,
    name: "조깅, 아점먹기",
    startHour: 10,
    startMin: 0,
    endHour: 12,
    endMin: 0,
    removed_at: nil,
    PlanChartId: -1,
    createdAt: "2024-05-27T12:31:54.295Z",
    notification: "15",
    tempId: "",
    updatedAt: "",
    subPlans: [
      SubPlanModel(PlanId: -1, createdAt: "2024-05-27T12:31:54.295Z", id: -1, name: "조깅하기", removed_at: nil, updatedAt: "2024-05-27T12:31:54.295Z", isCompleted: true),
      SubPlanModel(PlanId: -1, createdAt: "2024-05-27T12:31:54.295Z", id: -2, name: "아점먹기", removed_at: nil, updatedAt: "2024-05-27T12:31:54.295Z", isCompleted: false),


    ]
)

let snapshotPlan = PlanModel(
  id: -1,
  name: "조깅, 아점먹기",
  startHour: 10,
  startMin: 0,
  endHour: 12,
  endMin: 0,
  removed_at: nil,
  PlanChartId: -1,
  createdAt: "2024-05-27T12:31:54.295Z",
  notification: "15",
  tempId: "",
  updatedAt: "",
  subPlans: [
    SubPlanModel(PlanId: -1, createdAt: "2024-05-27T12:31:54.295Z", id: -1, name: "조깅하기", removed_at: nil, updatedAt: "2024-05-27T12:31:54.295Z", isCompleted: true),
    SubPlanModel(PlanId: -1, createdAt: "2024-05-27T12:31:54.295Z", id: -2, name: "아점먹기", removed_at: nil, updatedAt: "2024-05-27T12:31:54.295Z", isCompleted: false),
    SubPlanModel(PlanId: -1, createdAt: "2024-05-27T12:31:54.295Z", id: -3, name: "사과 한 개", removed_at: nil, updatedAt: "2024-05-27T12:31:54.295Z", isCompleted: false),
  ]
)

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), plan: snapshotPlan, token: "")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      let entry = SimpleEntry(date: Date(), plan: snapshotPlan, token: "snapshot_token")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        var plan: PlanModel? = nil
        let userDefaults = UserDefaults(suiteName: "group.com.plem.widget.do-it-now")
        let token = userDefaults?.string(forKey: "token")

        if (token == nil) {
          print("token is null")
          let entry = SimpleEntry(date: Date(), plan: nil, token: nil)
          let timeline = Timeline(entries: [entry], policy: .never)
          completion(timeline)
          return
        }

        let session = URLSession.shared
        let baseUrl = Bundle.main.object(forInfoDictionaryKey: "BASE_URL") as? String ?? ""
        let getDoItNowUrl = baseUrl + "/plans/doItNow"
      print("getDoItNowUrl", getDoItNowUrl)
        let url = URL(string: getDoItNowUrl)
      var request = URLRequest(url: url!)
      request.httpMethod = "GET"
      request.addValue(token!, forHTTPHeaderField: "Authorization")
      request.addValue("application/json", forHTTPHeaderField: "Content-Type")
      request.addValue("application/json", forHTTPHeaderField: "Accept")
      
        let task = session.dataTask(with: request) { (data, response, error) in
          guard error == nil else {
                  print("request API Error: Call error")
            self.createEmptyTimeline(completion: completion)
                  return
              }
          guard let response = response as? HTTPURLResponse, (200...300).contains(response.statusCode) else {
                  print("request API Error: Status Code not included in the scope")
            self.createEmptyTimeline(completion: completion)
                  return
              }

            guard let data = data else {
                print("No data received")
              self.createEmptyTimeline(completion: completion)
                return
            }

            do {
              let responseData = try JSONDecoder().decode(DoItNowResponseModel.self, from: data)
              print("responseData.data", responseData.data)
              plan = responseData.data.nowPlan
              let currentDate = Date()
              for minuteOffset in 0 ..< 1 {
                  let entryDate = Calendar.current.date(byAdding: .minute, value: minuteOffset, to: currentDate)!
                let entry = SimpleEntry(date: entryDate, plan: plan, token: token)
                  entries.append(entry)
              }

              let timeline = Timeline(entries: entries, policy: .atEnd)
              completion(timeline)
              

            } catch let error {
              print("JSON Decoding error: \(error)")
              self.createEmptyTimeline(completion: completion)
            }
        }
      
        task.resume()
    }
  
  private func createEmptyTimeline(completion: @escaping (Timeline<SimpleEntry>) -> ()) {
      let entry = SimpleEntry(date: Date(), plan: nil, token: nil)
      let timeline = Timeline(entries: [entry], policy: .never)
      completion(timeline)
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date, plan: PlanModel?, token: String?
}

func timePadStart(_ time: Int) -> String {
    return String(format: "%02d", time)
}

struct DoItNowEntryView : View {
    var entry: Provider.Entry
    
    var body: some View {
      VStack(alignment: .leading){
          if entry.token == "snapshot_token" {
            DoItNowComponent(plan: snapshotPlan)
          }
          else if entry.token == nil {
            Text("로그인 해주세요!").font(.custom("AaGongCatPen", size: 16)).foregroundColor(Color.black)
          }
          else if entry.plan == nil {
            
              ZStack {
                Text("계획을 추가해주세요!")
                  .font(.custom("AaGongCatPen", size: 18))
                  .foregroundColor(Color.black)
                  .background(Color.clear)
                  .lineLimit(1)
              }.fixedSize().frame(height: 32).padding(.top).padding(.horizontal)
              PlaceHolderSubPlan()
            Spacer()
            Spacer()
          }
          
          else if entry.plan!.subPlans.count > -1 {
            DoItNowComponent(plan: entry.plan!)
          }
          else {
            Text("계획을 추가해주세요!").font(.custom("AaGongCatPen", size: 18)).foregroundColor(Color.black).frame(width: 260, alignment: .topLeading)
          }
      }.frame(width: 338, height: 158).background(Color(red: 0.9569, green: 0.9451, blue: 0.9098))
    }
}

struct TextWidthPreferenceKey: PreferenceKey {
    typealias Value = CGFloat
    static var defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

struct DoItNow: Widget {
    let kind: String = "DoItNow"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
          DoItNowEntryView(entry: entry).widgetBackground()
        }
        .configurationDisplayName("Do it now")
        .description("지금 해야할 일을 한눈에 확인할 수 있어요.").supportedFamilies([.systemMedium])
    }
}

struct DoItNow_Previews: PreviewProvider {
    static var previews: some View {
      DoItNowEntryView(entry: SimpleEntry(date: Date(), plan: samplePlan, token: "snapshot_token"))
        .previewContext(WidgetPreviewContext(family: .systemMedium))
//        .background(.ultraThinMaterial)
        .widgetBackground()
    }
}

struct RowView : View {
  let subPlan : SubPlanModel
  var body: some View {
    HStack(alignment: .center){


      if subPlan.isCompleted {
        Image("CheckedCheckBox")
        Text(subPlan.name).font(.custom("AaGongCatPen", size: 16)).foregroundColor(Color.black).strikethrough(true).lineLimit(1).frame(width: 260, alignment: .leading)
      }
      else {
        Image("CheckBox")
        Text(subPlan.name).font(.custom("AaGongCatPen", size: 16)).foregroundColor(Color.black).lineLimit(1).frame(width: 260, alignment: .leading)
      }
    }.frame(height: 24).padding(.horizontal)
  }
}

struct PlaceHolderSubPlan : View {
  var body: some View {
    HStack(alignment: .center){
      Image("CheckBox")
      Text("할 일 추가하기").font(.custom("AaGongCatPen", size: 16)).foregroundColor(Color.black).lineLimit(1).frame(width: 260, alignment: .leading)
    }.frame(height: 24).opacity(0.2).padding(.horizontal)
  }
}

struct ViewMore : View {
  let viewMoreCount: Int
  var body: some View {
    
    Text("\(viewMoreCount)개의 할 일 더 확인하기").font(.custom("AaGongCatPen", size: 14)).foregroundColor(Color.black).lineLimit(1).frame(width: 338, height: 28, alignment: .center)
  }
}

struct DoItNowComponent : View {
  let plan: PlanModel
  
  var body: some View {
    let length = plan.subPlans.count
    HStack(alignment: .top){
      ZStack {
        RoundedRectangle(cornerRadius: 8)
          .fill(Color(red: 1, green: 0.902, blue: 0))
          .frame(height: 6)
        Text(plan.name)
          .font(.custom("AaGongCatPen", size: 16))
          .foregroundColor(Color.black)
          .background(Color.clear)
          .lineLimit(1)
      }.fixedSize()
      Spacer()
      Text("\(timePadStart(plan.startHour)):\(timePadStart(plan.startMin)) - \(timePadStart(plan.endHour)):\(timePadStart(plan.endMin))")
        .font(.custom("AaGongCatPen", size: 16))
        .foregroundColor(Color.black)
        .background(Color.clear)
        .lineLimit(1)
    }.frame(height: 32).padding(.top).padding(.horizontal)
    
    if length >= 0 && length < 3 {
      VStack(alignment: .leading){
        ForEach(plan.subPlans, id : \.self.id){ subPlan in
          RowView(subPlan: subPlan)
        }
        PlaceHolderSubPlan()
      }
    }
    if length == 3 {
      VStack(alignment: .leading){
        ForEach(plan.subPlans, id : \.self.id){ subPlan in
          RowView(subPlan: subPlan)
        }
      }
    }
    if length > 3 {
      RowView(subPlan: plan.subPlans[0])
      RowView(subPlan: plan.subPlans[1])
      ViewMore(viewMoreCount: length - 2)
    }
    Spacer()
    Spacer()
  }
}
