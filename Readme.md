Download monthly statements for invoicing, payments - like Barion, Billingo

Ha más is automatizálná az ismétlődő feladatokat...
Igen, a könyvelői hozzáférés a Billingo letöltések egy részét megoldja, azt viszont nem, amikor a könyvelő egészben kéri a csomagot. Havonta.
Amennyiben te feltöltöd a könyvelés részére az előző havi számlák exportját a Google Drivera, akkor itt az egyszerűsítés.

Használat:
1. A script.google.com oldalon nyiss egy új projektet és nevezd el, ahogy szeretnéd. 
2. Másold át a Code.gs és Conf.gs állományt a script.google.com-on egy új projektbe. 
3. Tölts ki a hiányzó kódokat és adatokat a Config.gs fájlban.
A Billingo API kulcsot a beállításokban találod, v3-as kulcs kell, olvasási és írási joggal.
A Barion POS kulcsot az üzlet beállítások alatt találod meg.
Ha a Google driveon egy adott könyvtártól szeretnéd kezdeni, mint XY_konyveles, akkor ennek az ID-jét a driven történő megnyitással, a böngésző címsorában látod, pl. 
https://drive.google.com/drive/u/0/folders/0B08NZKsas8t4OEtLAW1PQ3k4WVk?resourcekey=0-L-wMXRwGNC11tsCSHwMJUQ
id: 0B08NZKsas8t4OEtLAW1PQ3k4WVk
Az adott könyvtáraknál több szintet is megadhatsz, /-el elválasztva. Az esetleges év/hónapot dinamikusan cserélheted. Pl.
szamlak/kimeno vagy "'szamlak'yyyy'/kimeno'MM". Ha a hónap után -x szerepel, akkor a könyvtár is ez lesz "'szamlak'yyyy'/kimeno'MM-1" 2023. februárjában szamlak2023/kimeno01-é változik.
4. A futtatás gombra kattintva próbáld ki, hogy minden azt teszi-e, amit terveztél. Első futtatás előtt google engedélyt kér, melyet persze nyugtáznod kell.
5. Ha minden jó, megadhatsz egy triggert a futtatásra, a Barion kivonatok csak az adott hónap 4. napján készülnek el, így praktikus a hó 5.-ét vagy azt követő napot megadni. Állítsd be a monthlyStatements függvényt, időalapú futtatásra, havonta 6. nap 2:00-3:00 között.
6. A logokban láthatod a havi futtatásnál a feltött fájlokat, de persze a drivon is megtalálod.
