export function transformPollutionData(apiResponse) {
  // 污染物单位映射
  const pollutantUnits = {
    CO: "mg/m³",
    NO2: "μg/m³",
    O3: "μg/m³",
    PM10: "μg/m³",
    PM2_5: "μg/m³",
    SO2: "μg/m³",
    AQI: "",  // AQI没有单位
    Unheathful: ""  // 健康影响描述没有单位
  };

  // 污染物中文名称映射
  const pollutantNames = {
    CO: "一氧化碳",
    NO2: "二氧化氮",
    O3: "臭氧",
    PM10: "可吸入颗粒物",
    PM2_5: "细颗粒物",
    SO2: "二氧化硫",
    AQI: "空气质量指数",
    Unheathful: "健康影响"
  };

  // 提取需要转换的数据
  const { CO, NO2, O3, PM10, PM2_5, SO2, AQI, Unheathful } = apiResponse.result;
  
  // 创建污染物数组
  const pollutants = [
    { type: "PM2_5", value: PM2_5 },
    { type: "PM10", value: PM10 },
    { type: "NO2", value: NO2 },
    { type: "CO", value: CO },
    { type: "SO2", value: SO2 },
    { type: "O3", value: O3 },
    { type: "AQI", value: AQI },
    { type: "Unheathful", value: Unheathful }
  ];

  // 转换为最终格式
  return pollutants.map(item => ({
    name: pollutantNames[item.type] || item.type,
    type: item.type,
    value: item.value,
    unit: pollutantUnits[item.type] || "",
    // 添加颜色指示（AQI除外）
    level: item.type === "AQI" ? "" : getPollutionLevel(item.type, item.value)
  })).splice(0,6);
}
// 辅助函数：根据污染物类型和值获取污染等级
function getPollutionLevel(type, value) {
  const val = parseFloat(value);
  
  // 各污染物的等级阈值（示例值，实际应用中需使用官方标准）
  const thresholds = {
    PM2_5: [35, 75, 115, 150, 250],
    PM10: [50, 150, 250, 350, 420],
    NO2: [40, 80, 180, 280, 565],
    CO: [5, 10, 35, 60, 90],
    SO2: [50, 150, 500, 650, 800],
    O3: [100, 160, 215, 265, 800]
  };
  
  if (!thresholds[type]) return "";
  
  const [good, moderate, unhealthySensitive, unhealthy, veryUnhealthy] = thresholds[type];
  
  if (val <= good) return "优";
  if (val <= moderate) return "良";
  if (val <= unhealthySensitive) return "轻度污染";
  if (val <= unhealthy) return "中度污染";
  if (val <= veryUnhealthy) return "重度污染";
  return "严重污染";
}

export function processData(originalData) {
  // 创建三个空数组用于存储结果
  const hours = [];
  const aqis = [];
  const qualities = [];

  // 遍历原始数据中的 Data 数组
  originalData.forEach(item => {
    // 提取小时部分 (HH)
    const hour = item.Time.split(' ')[1].substring(0, 2)+'时';
    hours.push(hour);
    
    // 提取 AQI 值并转为数字
    aqis.push(Number(item.AQI));
    
    // 提取质量等级
    qualities.push(item.Quality);
  });

  // 按时间顺序排列（原始数据是倒序的）
  hours.reverse();
  aqis.reverse();
  qualities.reverse();

  // 返回结果对象
  return {
    hours,
    aqis,
    qualities
  };
}

// 根据AQI值判断质量等级
export function getQualityByAQI(aqi) {
    if (aqi <= 50) return "优";
    if (aqi <= 100) return "良";
    if (aqi <= 150) return "轻度污染";
    if (aqi <= 200) return "中度污染";
    if (aqi <= 300) return "重度污染";
    return "严重污染";
}

export function processDailyData(originalData) {
  // 创建三个空数组用于存储结果
  const days = [];
  const aqis = [];
  const qualities = [];



  // 遍历原始数据中的 Data 数组
  originalData.Data.forEach(item => {
    // 提取日期中的"日"部分 (DD)
    const day = item.Date.split('-')[2]+'号';
    days.push(day);

    // 提取 AQI 值并转为数字
    const aqiValue = Number(item.AQI);
    aqis.push(aqiValue);
    
    // 获取质量等级（如果数据中有Quality字段则使用，否则根据AQI计算）
    if (item.Quality) {
      qualities.push(item.Quality);
    } else {
      qualities.push(getQualityByAQI(aqiValue));
    }
  });

  // 按时间顺序排列（原始数据是倒序的）
  days.reverse();
  aqis.reverse();
  qualities.reverse();

  // 返回结果对象
  return {
    days,
    aqis,
    qualities
  };
}

export const transformLifeObject = (lifeObj) => {
  // 键名转换映射
  const keyMapping = {
    daisan: "san",
    ganmao: "ganmaozhishu",
    shushidu: "xintubiao_shushidu"
  };
  // 排除 'chuanyi' 并转换为数组
  return Object.entries(lifeObj)
    .filter(([key]) => key !== 'chuanyi') // 过滤掉 chuanyi
    .map(([type, data], index) => {
      // 应用键名转换，如果映射中不存在则使用原键名
      const mappedType = keyMapping[type] || type;
      
      return {
        id: index + 1,             // 添加数字索引 (从1开始)
        type: mappedType,           // 使用转换后的键名
        ...data                    // 展开原始数据 (v 和 des)
      };
    });
};

export const formatDate=(dateStr, format = 'weekday')=> {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "无效日期";
  
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const day = date.getDate();
  
  switch(format) {
    case 'weekday':
      return `周${weekdays[date.getDay()]} ${day}号`;
    case 'full':
      return `${date.getFullYear()}年${date.getMonth() + 1}月${day}日 周${weekdays[date.getDay()]}`;
    case 'simple':
      return `${date.getMonth() + 1}月${day}日`;
    default:
      return `${date.getMonth() + 1}/${day} 周${weekdays[date.getDay()]}`;
  }
}

export const nowData=(item)=>{
    const d = new Date(item);
  return `${d.getMonth()+1}月${d.getDate()}日 ${
    d.getHours().toString().padStart(2, '0')
  }:${
    d.getMinutes().toString().padStart(2, '0')
  }`;
} 

export function getCityCode(cityName) {
  // 城市编码映射表
  const cityMap = {
    '北京': 1,
    '上海': 9,
    '广州': 189,
    '深圳': 191,
    '成都': 226,
    '杭州': 82,
    '南京': 69,
    '重庆': 22,
    '西安': 278,
    '武汉': 162,
    '桂林':212
  };
  
  // 查找城市编码，不存在则返回 -1
  return cityMap[cityName] ?? -1;
}