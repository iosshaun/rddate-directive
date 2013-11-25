var CAL_FieldSeperator = "/";

function dateToString(day,month,year) {
  return day+CAL_FieldSeperator+(month+0)+CAL_FieldSeperator+year;
}

function stringToDateYear(str) {
  var curFields = str.split(CAL_FieldSeperator);
  var ret = null;
  if( curFields.length == 3 ) {
    ret = parseInt(curFields[2]); 
    if(isNaN(ret)) ret = null;
    if( ret < 30 ) ret += 2000;
    if( ret < 100 ) ret += 1900;
  }
  return ret;
}

function stringToDateMonth(str) {
  var curFields = str.split(CAL_FieldSeperator);
  var ret = null;
  if( curFields.length == 3 )
  {
    ret = monthIndexByName(curFields[1].toUpperCase());
    if( ret == null ) { ret = parseInt(curFields[1],10); if( !isNaN(ret) ) ret -= 0; }
    if(isNaN(ret)) ret = null;
  }
  return ret;
}

function stringToDateDay(str) {
  var curFields = str.split(CAL_FieldSeperator);
  var ret = null;
  if( curFields.length == 3 ) {
    ret = parseInt(curFields[0]); 
    if(isNaN(ret)) ret = null;
  }
  return ret;
}

function getCalField(fieldName) {
  for( i=0; i<document.forms.length; i++ ) {
    for( j=0; j<document.forms[i].elements.length; j++ ) {
      if( document.forms[i].elements[j].name == fieldName ) 
        return document.forms[i].elements[j];
    }
  }
  return null;
}

function monthString(month) {
  switch(month) {
  case 1: return "January";    case 2: return "Febuary";    case 3: return "March";  
  case 4: return "April";      case 5: return "May";        case 6: return "June";  
  case 7: return "July";       case 8: return "August";     case 9: return "September";  
  case 10: return "October";   case 11: return "November";  case 12: return "December";
  }
}

function shortMonthString(month) { return monthString(month).substr(0,3); } //.toUpperCase()

function dayOfMonth(year,month,day) { return (new Date(year,month-1,day)).getDay(); }

function daysInMonth(year,month) {
  d1 = new Date(year,month,1);
  d2month = month+1; d2year = year;
  if( month == 12 ) { d2month = 1; d2year = year+1; }
  msDiff = Date.UTC(d2year,d2month-1,1,0,0,0) - Date.UTC(year,month-1,1,0,0,0);
  dayDiff = ((msDiff/1000) / 3600) / 24;
  return dayDiff;
}

var calWindow = null;
var calField = null;
var calWindowIgnoreReset = false;
var calWindowX = 0;
var calWindowY = 0;

function resetPopupCalendar() {
  if( ! calWindowIgnoreReset ) {
    if( calField != null ) calField.focus();
    calWindow = null;
    calField = null;
  }
  calWindowIgnoreReset = false;
}

function closePopupCalendar(year,month,day) {
  if( calWindow != null ) {
    if(year!=null && year!='undefined'){
      calField.value = dateToString(day,month,year);
    }
    calWindow.close();
    resetPopupCalendar();
  }
}

function monthIndexByName(mn) {
  for(i=1; i<=12; i++)
      if( shortMonthString(i).toUpperCase() == mn.toUpperCase() )
          return i;
  return null;
}

function iconTag(iconname) {
  if( iconname == "arrow-ll" ) return "<font id=nav>&nbsp;&lt;&lt;&nbsp;</font>";
  if( iconname == "arrow-l" ) return "<font id=nav>&nbsp;&lt;&nbsp;</font>";
  if( iconname == "arrow-rr" ) return "<font id=nav>&nbsp;&gt;&gt;&nbsp;</font>";
  if( iconname == "arrow-r" ) return "<font id=nav>&nbsp;&gt;&nbsp;</font>";
  return '<img src=images/icon-'+iconname+'.gif width=15 height=15 border=0>';
}

var bg_color = "#f8f8f8";
var ln_color = "#858585";
var sl_color = "#000000";

function openPopupCalendarXY(fieldname,x,y,event, bgc, lnc, slc) {
  calWindowX = x - 100; if( calWindowX < 0 ) calWindowX = 0;
  calWindowY = y - 120; if( calWindowY < 0 ) calWindowY = 0;
  if(bgc!=null) bg_color = bgc;
  if(lnc!=null) ln_color = lnc;
  if(slc!=null) sl_color = slc;
  openPopupCalendar(fieldname);
}

function openPopupCalendar(fieldname,year,month) {
  curValue = '';
  calField = getCalField(fieldname);
  if( calField == null ) {
    alert("ERROR: Calendar field not found: "+fieldname);
    return;
  }
  curValue = calField.value;
  curYear = null; curMonth = null; curDay = null;
  curYear = stringToDateYear(curValue);
  curMonth = stringToDateMonth(curValue);
  curDay = stringToDateDay(curValue);

  todaysDay = (new Date()).getDate();
  todaysMonth = (new Date()).getMonth()+1;
  todaysYear = (new Date()).getYear(); if( todaysYear < 1900 ) todaysYear += 1900;

  day = (((year==null)&&(month==null))?(curDay==null?todaysDay:curDay):-1);
  year = (year==null?(curYear==null?todaysYear:curYear):year);
  month = (month==null?(curMonth==null?todaysMonth:curMonth):month);

  if( month < 1 ) { month = 12; year --; }
  if( month > 12 ) { month = 1; year ++; }

  if( (calWindow == null) || (calWindow.document == null) ) {
    calWindow = open("", 'popupCalendarWindow', 'height=220,width=200,scrollbars=no,'+
                         'screenX='+calWindowX+',screenY='+calWindowY+','+
                         'left='+calWindowX+',top='+calWindowY+'');
  } else {
    calWindowIgnoreReset = true;
  }
  if( calWindow == null ) {
    alert("ERROR: Failed to create window.");
    return;
  }
  calWindow.focus();

  calWindow.document.open();
  s='';
  s=s+'<html><head><title>Calendar</title>\n<style type="text/css"><!--\n';
  s=s+'A, B, P, BR, BODY, FONT, LI, OL, UL, TD, TH, TABLE, TEXT {\n';
  s=s+'font-family: Arial, Helvetica;\nfont-size: 12px;\n}\n';
  s=s+'#nav {\n  font-family: Arial, Helvetica;\n  font-size: 14px;\n  color: #fff;\n  text-decoration:none;\n  font-weight:bold;\n}\n';
  s=s+'//--></style>\n';
  s=s+'<script>\n';
  s=s+'function processKeyPress(oB, oEvent) {\n';
  s=s+'  switch (oEvent.keyCode) {\n';
  s=s+'    case 27:\n';
  s=s+'       opener.closePopupCalendar();\n';
  s=s+'    default:\n';
  s=s+'      return false;\n';
  s=s+'}}\n';
  s=s+'</script>\n';
  s=s+'</head>\n';
  s=s+'<body bgcolor='+bg_color+' text='+ln_color+' alink='+ln_color+' link='+ln_color+' vlink='+ln_color+'\n';
  s=s+'      marginwidth=0 marginheight=0 leftmargin=0 topmargin=0 onkeypress=\"return processKeyPress(this, event)\" onunload=\"opener.resetPopupCalendar()\">\n';
  s=s+'<table width=100% height=100% border=0 cellpadding=2 cellspacing=0>\n';
  s=s+'<tr bgcolor='+ln_color+'><td>&nbsp;</td><td colspan=7 align=center width=100%>';
  s=s+'<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td>';
  tmp1 = '<a href="javascript:opener.openPopupCalendar(\''+fieldname+'\',';
  s=s+tmp1+(year-1)+','+(month)+');">'+iconTag('arrow-ll')+'</a>&nbsp;';
  s=s+tmp1+(year)+','+(month-1)+');">'+iconTag('arrow-l')+'</a>';
  s=s+'</td><td width=100% align=center><b><font color=#fff>'+shortMonthString(month)+' '+year+'</font></b></td><td>';
  s=s+tmp1+(year)+','+(month+1)+');">'+iconTag('arrow-r')+'</a>&nbsp;';
  s=s+tmp1+(year+1)+','+(month)+');">'+iconTag('arrow-rr')+'</a>';
  s=s+'</td></tr></table>\n';
  s=s+'</td><td>&nbsp;&nbsp;</td></tr>\n';
  s=s+'<tr><td>&nbsp;</td>';
  s=s+'<td align=right>Su</td><td align=right>Mo</td>';
  s=s+'<td align=right>Tu</td><td align=right>We</td>';
  s=s+'<td align=right>Th</td><td align=right>Fr</td>';
  s=s+'<td align=right>Sa</td><td>&nbsp;</td></tr>\n';
  days = daysInMonth(year,month);
  dom = -dayOfMonth(year,month,1) + 1;
  for(row=0; row<6; row++) {
    s=s+'<tr><td>&nbsp;</td>';
    for(col=0; col<7; col++) {
      if( (dom < 1) || (dom > days) ) {
        s=s+'<td>&nbsp;</td>';
      } else {
        s=s+'<td align=right><a href="javascript:opener.closePopupCalendar('+year+','+month+','+dom+');">';
        if( day == dom ) s=s+'<b style=\"font-size:14px; color:'+sl_color+';\">'+dom+'</b></a></td>';
        else s=s+dom+'</a></td>';
      }
      dom ++;
    }
    s=s+'<td>&nbsp;</td></tr>\n';
  }
  s=s+'</tr></table>\n';
  s=s+'</body></html>\n';
  calWindow.document.write(s);
  calWindow.document.close();
}

function openPopupLov(p_href) {
  calWindow = open(p_href,'popupLovWindow', 'height=400,width=400,scrollbars=yes,resizable=yes');
  calWindow.focus();
}
