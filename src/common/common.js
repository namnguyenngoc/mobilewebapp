function getKyTinh(sbankObj, sDate, sDay, isDay) {
  var kyTinh = "";
  var deltaMonth = 1;
  var month = sDate.getMonth();
  var deltaYear = 0;
  var day = 21;
  var newMonth = month;
  var newYear = 2021
  if (sbankObj != undefined && sbankObj != null) {
    var sBanName = sbankObj.name;
    if (
      ((sBanName == "HSBC" || sBanName == "SHINHAN") && sDay + 1 >= 21) ||
      (sBanName == "SC BANK" && sDay + 1 >= 19) ||
      (sBanName == "CitiBank" && sDay + 1 >= 27)
    ) {
      deltaMonth = 2;
    } else {
      deltaMonth = 1;
    }

    if (sDate.getMonth() + deltaMonth > 12) {
      deltaYear = 1;
      kyTinh = "1" + (sDate.getFullYear() + deltaYear).toString();
      newMonth = 1;
      newYear = sDate.getFullYear() + deltaYear;
    } else {
      kyTinh =
        (month + deltaMonth).toString() +
        (sDate.getFullYear() + deltaYear).toString();
      newMonth = month + deltaMonth;
      newYear = sDate.getFullYear() + deltaYear;

    }
  }
  console.log("year-bank:" + sbankObj);
  console.log("kyTinh-" + sBanName + ":" + kyTinh);
  if(sbankObj == "HSBC"){
    day = 21;
  } else if(sbankObj == "VIB"){
    day = 25;
  } else if(sbankObj == "SB BANK"){
    day = 19;
  }
  
  if(isDay){
    kyTinh = {
      day: day,
      month: newMonth,
      year: newYear,
    }
  } 
  return kyTinh;
}

function getDateSaoKe(bank){
  let condition = JSON.parse(bank);
  let sDate = new Date();
  if (condition != undefined && condition.date != undefined){
    sDate = new Date(condition.date);
  }
  var month = sDate.getMonth();
  var day = sDate.getDate();
  var year = sDate.getFullYear();
  
  if('HSBC' == condition.bank){
   if(day > 21) {
      month = month + 1;
    }
    day = 21;

  } else if('SC BANK' == condition.bank){
    if(day > 19) {
      month = month + 1;
    }
    day = 19;

  } else if(condition.bank =='CITI BANK'){
    if(day > 27) {
      month = month + 1;
    }
    day = 27;
  } else if(condition.bank =='VIB'){
    if(day > 25) {
      month = month + 1;
    }
    day = 25;
  }

  var mydate = new Date(year, month, day); 
  console.log(mydate.toDateString());
  return mydate;
}

/**
 * 
 * @param {*} bank 
 * @param {*} sDate : NGÀY GIAO DICH
 */
function getDateThanhToan(bank){
  let condition = JSON.parse(bank);
  let sDate = new Date();
  if (condition != undefined && condition.date != undefined){
    sDate = new Date(condition.date);
  }
  var dSaoKe = getDateSaoKe(bank, sDate);
  if('HSBC' == condition.bank){
    dSaoKe.setDate(dSaoKe.getDate() + 25);

  } else if('SC BANK' == condition.bank){
    dSaoKe.setDate(dSaoKe.getDate() + 25);
    
  } else if('CITI BANK' == condition.bank){
    dSaoKe.setDate(dSaoKe.getDate() + 17);
  }
  else if('VIB' == condition.bank){
    dSaoKe.setDate(dSaoKe.getDate() + 15);
  }
  // var mydate = new Date(year, month, day); 
  console.log(dSaoKe.toDateString());
  return dSaoKe;
}

function getDateSaoKeAPI(req, res, next) {
  // if(req.params  != undefined && req.params.bank != undefined){
    
  let dateStr = getDateSaoKe(req.params.bank, req.params.date);
  res.status(200)
  .json({
    status: 'success',
    data: JSON.stringify({'date': dateStr.toDateString()}),
    message: 'getDateSaoKeAPI'
  });
}
function getDateThanhToanAPI(req, res, next) {
  // if(req.params  != undefined && req.params.bank != undefined){
    
  let dateStr = getDateThanhToan(req.params.bank, req.params.date);
  res.status(200)
  .json({
    status: 'success',
    data: JSON.stringify({'date': dateStr.toDateString()}),
    message: 'getDateThanhToan'
  });
}
//Convert object to ""
function utn(obj){
  if(obj == undefined || obj == null)
    return "";
  return obj;
}
const common = {
  utn                 : utn,
  getDateSaoKeAPI: getDateSaoKeAPI,
  getDateThanhToanAPI:getDateThanhToanAPI,
  getDateSaoKe:getDateSaoKe,
  getDateThanhToan:getDateThanhToan,
  getKyTinh: getKyTinh,
}

module.exports = common;