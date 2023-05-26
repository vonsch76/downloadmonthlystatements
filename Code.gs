let conf = downloadconfig();

function monthlyStatements() {
  if(conf.billingo_apikey.length > 0)
    get_billingo_exports();
  if(conf.barion_poskey.length > 0)
    get_barion_statements();
}

function get_billingo_exports(){
  let exp_type = conf.billingo_exp;

  exp_type.forEach(function(exp) {
    let resp, ftodownload;
    resp = billingoRequest('POST', '/document-export', undefined, {'query_type' : 'fulfillment_date', 'start_date' : prevMonth(true), 'end_date' : prevMonth(false), 'export_type' : exp} );
    if(resp['code'] == 201){
      Logger.log('Document requested. ' + exp + ' /document-export/ ' + resp['payload']['id']);
      ftodownload = resp['payload']['id'];
      for(let i=0; i < 3; i++ ) {
      Utilities.sleep(8000);
      resp = billingoRequest('GET', '/document-export/' + ftodownload + '/download', undefined, undefined );
        if(resp['code'] == 200) {
          switch(exp){
            case 'simple_excel':
              blob = Utilities.newBlob(resp.payload, MimeType.MICROSOFT_EXCEL, conf.invfile_pre + exp + prevMonth(null, true) + '.xlsx');
              break;
            case 'ima':
            case 'simple_csv':
            case 'rlb_double_entry':
            case 'relax':
              blob = Utilities.newBlob(resp.payload, MimeType.CSV, conf.invfile_pre + exp +  prevMonth(null, true) + '.csv');
              break;
            case 'rlb':
              blob = Utilities.newBlob(resp.payload, 'application/dbase; version="IV"', 'KSZLAK.DBF');
              break;
            case 'rlb60':
              blob = Utilities.newBlob(resp.payload, 'application/dbase; version="IV"', 'KSZLAKET.DBF');
              break;
            case 'ex_panda':
            case 'forintsoft':
            case 'hessyn':
            case 'infoteka':
            case 'nagy_machinator':
              blob = Utilities.newBlob(resp.payload, 'XML 1.0 document', conf.invfile_pre + exp + prevMonth(null, true) + '.xml');
              break;
            case 'kulcs_konyv':
              blob = Utilities.newBlob(resp.payload, MimeType.ZIP, conf.invfile_pre + exp + prevMonth(null, true) + '.zip');
              break;
            case 'maxitax':
            case 'novitax':
            case 'tensoft':
            case 'tensoft_29_dot_65':
              blob = Utilities.newBlob(resp.payload, MimeType.PLAIN_TEXT, conf.invfile_pre + exp + prevMonth(null, true) + '.zip');
              break;
           }
        Logger.log(blob.getContentType());
        break;
      } else if(resp['code'] == 202){
        Logger.log('Document is not ready for download yet. ' + exp + ' /document-export/: ' + ftodownload + '/download' + ' ...rettying...');
        continue;
      } else
        Logger.log('Error at downloading the file. /document-export/id/download reply: ' + resp['code']);
      }
    } else
      Logger.log('Error at preparing for download. /document-export reply: ' + resp);
    if(typeof blob != 'undefined'){
      uploadFile(blob, conf.billFolder);
      ftodownload = undefined;
    }
  })
}

function get_barion_statements(){
  let exp_type = conf.barion_exp;
  let d = new Date();

  exp_type.forEach(function(exp) {
    let resp;
    resp = barionRequest('GET','/Statement/Download', {'Year' : d.getMonth() === 0 ? d.getFullYear()-- : d.getFullYear(), 'Month' : d.getMonth() === 0 ? 11 : d.getMonth(), 'currency': exp}, undefined);
    if(resp.code == 200){
      blob = Utilities.newBlob(resp.payload, MimeType.PDF, 'barion_' + exp + prevMonth(null, true) + '.pdf');
    } else
      Logger.log('Error occured ' + resp);
    uploadFile(blob);
  });
}

function billingoRequest(proto, page, params, argums) {
  let pay, resp;

  let url = 'https://api.billingo.hu/v3' + page;
  if(typeof params !== 'undefined')
    url = url.addQuery(params);
  if(typeof argums !== 'undefined') 
    pay = JSON.stringify(argums);
  let args = {  'method' : proto,
                'headers' : {
                  'X-API-KEY' : conf.billingo_apikey,
                },
                'muteHttpExceptions' : true,
  }; 
  if(typeof pay !== 'undefined'){
    args['payload'] = pay;
    args['contentType'] = 'application/json';
  }

  resp = UrlFetchApp.fetch(url,args);
  return ({'code' : resp.getResponseCode(), 'payload' : resp.getContentText().charAt(0) == '{' ?JSON.parse(resp.getContentText()) : resp.getContent()});
}

function uploadFile(blob, folder = undefined){
  let folderName, d;
  folderName = typeof folder == 'undefined' ? conf.Folder : folder;

  if(folderName.search("MM-") !== -1 ){
    d = new Date();
    d.setMonth(d.getMonth() + parseInt(folderName.substring(folderName.indexOf("MM-")+2,folderName.indexOf("MM-")+4)));
        folderName = Utilities.formatDate(d, "GMT+1", folderName.replace("MM"+folderName.substring(folderName.indexOf("MM-")+2,folderName.indexOf("MM-")+4),"MM"));
  } 
  folderName = folderName.replace(':', '');
  folder = getOrCreateFolder(folderName, conf.parentFolderId);
  file = folder.createFile(blob);
  Logger.log('File: ' + file.getName() + ' was uploaded.');
}

function getOrCreateFolder(folderName, parentFolderId) {
  let folder;
  try {
    folder = getFolderByPath(folderName, parentFolderId);
  } catch(e) {
    var folderArray = folderName.split("/");
   var parentFolder = parentFolderId ? DriveApp.getFolderById(parentFolderId) : DriveApp.getRootFolder();

    if (parentFolder) {
      folder = getOrCreateSubFolder(parentFolder, folderArray);
    }
  }
  return folder;
}

function getFolderByPath(path, parentFolderId) {
  let parts = path.split("/");

  if (parts[0] == '') parts.shift(); // Did path start at root, '/'?

  let folder = parentFolderId ? DriveApp.getFolderById(parentFolderId) : DriveApp.getRootFolder();

  for (var i = 0; i < parts.length; i++) {
    var result = folder.getFoldersByName(parts[i]);
    if (result.hasNext()) {
      folder = result.next();
    } else {
      throw new Error( "folder not found." );
    }
  }
  return folder;
}

function prevMonth(first=undefined, fordir=undefined){
  let now = new Date();
  let prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
  let prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);

  let formatDateComponent = function(dateComponent) {
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  };

  let formatDate = function(date) {
    if(fordir === true)
      return formatDateComponent(date.getFullYear()) + '_' + formatDateComponent(date.getMonth() + 1));
    else
      return formatDateComponent(date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1)) + '-' + formatDateComponent(date.getDate());
  };

  if(first === true)
    return formatDate(prevMonthFirstDate);
  else
    return formatDate(prevMonthLastDate);
}

String.prototype.addQuery = function (obj) {
  return this + "?" + Object.entries(obj).flatMap(([k, v]) => Array.isArray(v) ? v.map(e => `${k}=${encodeURIComponent(e)}`) : `${k}=${encodeURIComponent(v)}`).join("&");
}

function barionRequest(proto, page, params, argums) {
  let pay, resp;

  let url = 'https://api.barion.com/v2' + page;
  params['POSKey'] = conf.barion_poskey;
    url = url.addQuery(params);
  if(typeof argums !== 'undefined') 
    pay = JSON.stringify(argums);
  let args = {  'method' : proto
  }; 
  if(typeof pay !== 'undefined'){
    args['payload'] = pay;
    args['contentType'] = 'application/json';
  }

  resp = UrlFetchApp.fetch(url,args);
  return ({'code' : resp.getResponseCode(), 'payload' : resp.getContentText().charAt(0) == '{' ?JSON.parse(resp.getContentText()) : resp.getContent()});
}
