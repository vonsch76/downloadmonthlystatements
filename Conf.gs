function downloadconfig() {
  return {
    // Billingo settings
    'billingo_exp'    : ['rlb60','simple_excel'],
    // valid fields  armada, aws_batch, ex_panda, forintsoft, hessyn, ima, infoteka, kulcs_konyv, maxitax, nagy_machinator, nav_ptgszlah, nav_status, nav_xml, nav_xml_alias, novitax, proforma_outstanding, relax, rlb, rlb60, rlb_double_entry, simple_csv, simple_excel, simple_excel_items, tensoft, tensoft_29_dot_65 
    'billingo_apikey' : '',
    'Folder'          : "'bevetel_kivonatok'_yyyy/yyyy_MM-1",
    //folder name can be anything below the parentfolder, yyyy are replaced to current year, MM to current month. Special that MM-1 will return the previous month, so in Feb. 2023, this will give you kimeno_szamlak_2023/2023_01 The directory is created when non-existent.
    'parentFolderId'  : '',
    //can be empty, then the root will be used as a starting point
   'billFolder'      : "",
    //when you prefer the accounting related exports in a different folder. Uses same logic as colder. Can be empty.
    'invfile_pre'     : 'szamlak_',
    //exports will start like that, the logic is invfile_pre + export type + year and month + extension
    
    //Barion settings
    'barion_exp'      : ['HUF','EUR'],
    //valid inpusts, CZK, EUR, HUF, USD
    'barion_poskey'   : '',
  };
}
