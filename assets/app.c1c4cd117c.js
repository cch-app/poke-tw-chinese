'use strict';
// ==================== data.js ====================
// ===== 內容資料 =====
// 依臺師大《當代中文課程》各冊主題編排的原創練習句；正式版請匯入授權課本詞表。
// 22 個縣市（6 直轄市 + 3 市 + 13 縣），從桃園出發，逆時針繞臺灣一圈，最後是外島。
// pool: ['v',詞,en,ja,lv] | ['g',句(＿＿),答,'誤1|誤2|誤3',en,ja,lv] | ['l',句,en,ja,lv]
// read.qs: [問題,答案,'誤1|誤2']
const CITIES=[
{id:'taoyuan',zh:'桃園',en:'Taoyuan',ja:'桃園',x:63,y:18.5,leader:'小凱',role:["Airport ground staff","空港の地上スタッフ"],theme:'打招呼',roof:'#e4572e',emblem:'plane',tree:'broad',
 hello:[['歡迎來到桃園！我是機場的小凱。',"Welcome to Taoyuan! I'm Kai from the airport.","桃園へようこそ！空港のカイだよ。"],['很多旅人都從這裡開始。你好嗎？',"Many travelers start here. How are you?","多くの旅人がここから始めるんだ。元気？"]],
 read:{p:'小凱在桃園機場工作。他每天都說很多次「你好」跟「謝謝」。今天有一個日本人問他：「請問，這裡是桃園嗎？」小凱說：「是，歡迎來到臺灣！」',
  qs:[['小凱在哪裡工作？','桃園機場','臺北車站|日本'],['小凱每天常常說什麼？','你好跟謝謝','對不起跟再見|早安跟晚安'],['今天誰問小凱問題？','一個日本人','一個老師|小凱的朋友']]},
 pool:[['v','你好',"hello","こんにちは",1],['v','謝謝',"thank you","ありがとう",1],['v','再見',"goodbye","さようなら",1],['v','對不起',"sorry","ごめんなさい",2],['v','請',"please","どうぞ・お願いします",2],['v','好',"good; fine","いい・元気",3],
  ['g','你好＿＿？','嗎','呢|的|是',"How are you?","お元気ですか？",2],['g','我很好，＿＿！','謝謝','再見|對不起|請',"I'm fine, thank you!","元気です、ありがとう！",3],
  ['l','你好！歡迎來到臺灣。',"Hello! Welcome to Taiwan.","こんにちは！台湾へようこそ。",2],['l','對不起，我不會說中文。',"Sorry, I can't speak Chinese.","すみません、中国語が話せません。",3],['l','謝謝你，再見！',"Thank you, goodbye!","ありがとう、さようなら！",1]]},
{id:'hsinchuco',zh:'新竹縣',en:'Hsinchu County',ja:'新竹県',x:52,y:25,leader:'阿妹',role:["Hakka tea farmer","客家の茶農家"],theme:'家人',roof:'#c96f2a',emblem:'persimmon',tree:'broad',
 hello:[['我是客家人，我家有很多人喔！',"I'm Hakka, and my family is big!","私は客家人で、うちは大家族なの！"],['你家有幾個人？',"How many people are in your family?","あなたの家族は何人？"]],
 read:{p:'阿妹家在新竹縣，她家有六個人：爸爸、媽媽、兩個哥哥、一個妹妹跟她。她爸爸媽媽種茶，哥哥們在臺北工作。阿妹很喜歡她的家。',
  qs:[['阿妹家有幾個人？','六個人','五個人|四個人'],['阿妹的爸爸媽媽做什麼？','種茶','在臺北工作|當老師'],['阿妹有幾個哥哥？','兩個','一個|沒有']]},
 pool:[['v','爸爸',"dad","お父さん",4],['v','媽媽',"mom","お母さん",4],['v','哥哥',"older brother","兄",5],['v','妹妹',"younger sister","妹",5],['v','家人',"family members","家族",6],['v','幾',"how many","いくつ",6],
  ['g','你家有＿＿個人？','幾','什麼|誰|哪',"How many people are in your family?","家族は何人ですか？",5],['g','我＿＿一個哥哥。','有','是|在|很',"I have an older brother.","兄が一人います。",6],
  ['l','我家有五個人。',"There are five people in my family.","うちは五人家族です。",4],['l','這是我媽媽，她是老師。',"This is my mom; she is a teacher.","こちらは母で、先生です。",5],['l','我沒有妹妹，我有兩個哥哥。',"I don't have a younger sister; I have two older brothers.","妹はいません、兄が二人います。",6]]},
{id:'hsinchu',zh:'新竹市',en:'Hsinchu City',ja:'新竹市',x:47,y:29,leader:'阿風',role:["Engineer","エンジニア"],theme:'數字・時間',roof:'#2f7fc1',emblem:'wind',tree:'broad',
 hello:[['新竹的風很大，時間也過得很快！',"Hsinchu is windy, and time flies!","新竹は風が強くて、時間もあっという間！"],['現在幾點？你知道嗎？',"What time is it? Do you know?","今何時か分かる？"]],
 read:{p:'新竹風很大。小風每天早上七點起床，七點半吃早餐，八點坐公車去公司。他晚上六點下班，九點看書，十一點睡覺。',
  qs:[['小風幾點吃早餐？','七點半','七點|八點'],['小風怎麼去公司？','坐公車','坐捷運|走路'],['小風幾點睡覺？','十一點','九點|六點']]},
 pool:[['v','現在',"now","今",7],['v','點',"o'clock","～時",7],['v','分',"minute","～分",8],['v','半',"half","半",8],['v','早上',"morning","朝",9],['v','晚上',"evening","夜",9],
  ['g','現在三＿＿半。','點','個|號|年',"It's half past three.","今三時半です。",8],['g','我早上七點＿＿床。','起','睡|上|去',"I get up at seven in the morning.","私は朝七時に起きます。",9],
  ['l','現在十點十五分。',"It's 10:15 now.","今十時十五分です。",7],['l','我們晚上八點見。',"Let's meet at 8 p.m.","夜八時に会いましょう。",8],['l','這本書三百五十塊。',"This book is NT$350.","この本は三百五十元です。",9]]},
{id:'miaoli',zh:'苗栗',en:'Miaoli',ja:'苗栗',x:41.4,y:38,leader:'莓莓',role:["Strawberry farmer","イチゴ農家"],theme:'日期・喜歡',roof:'#d93a5b',emblem:'strawberry',tree:'broad',
 hello:[['大湖的草莓最好吃了！',"Dahu strawberries are the best!","大湖のイチゴは最高！"],['你喜歡什麼？我們星期六一起去摘草莓吧！',"What do you like? Let's pick strawberries on Saturday!","何が好き？土曜日に一緒にイチゴ狩りしよう！"]],
 read:{p:'莓莓家在苗栗大湖，她家種草莓。每年一月到四月，很多人週末來摘草莓。今天是星期六，也是莓莓的生日。她的朋友來幫她摘草莓，還送她一個草莓蛋糕。',
  qs:[['很多人什麼時候來摘草莓？','週末','星期一|晚上'],['今天是什麼日子？','莓莓的生日','新年|星期天'],['朋友送莓莓什麼？','草莓蛋糕','一本書|一杯茶']]},
 pool:[['v','星期',"week; day of the week","週・曜日",10],['v','今天',"today","今日",10],['v','明天',"tomorrow","明日",11],['v','喜歡',"to like","好き",11],['v','週末',"weekend","週末",12],['v','生日',"birthday","誕生日",12],
  ['g','今天星期＿＿？','幾','什麼|哪|誰',"What day of the week is it today?","今日は何曜日ですか？",11],['g','我很＿＿吃草莓。','喜歡','星期|明天|週末',"I really like eating strawberries.","イチゴを食べるのが大好きです。",12],
  ['l','我的生日是五月十號。',"My birthday is May 10.","私の誕生日は五月十日です。",10],['l','明天是星期六，我們去爬山吧。',"Tomorrow is Saturday; let's go hiking.","明日は土曜日だから、山に登ろう。",12],['l','週末你喜歡做什麼？',"What do you like to do on weekends?","週末は何をするのが好きですか？",13]]},
{id:'taichung',zh:'臺中',en:'Taichung',ja:'台中',x:35.1,y:52,leader:'美珍',role:["Sun cake baker","太陽餅職人"],theme:'吃東西',roof:'#e0902b',emblem:'suncake',tree:'broad',
 hello:[['歡迎光臨！我做的太陽餅最好吃了。',"Welcome! My sun cakes are the best.","いらっしゃい！私の太陽餅が一番おいしいよ。"],['不過，要先回答我的問題才能吃喔！',"But answer my questions before you eat!","でも、まず私の問題に答えてからね！"]],
 read:{p:'臺中有很多好吃的東西。美珍的店賣太陽餅，一盒六個，兩百塊。今天買兩盒送一杯茶。很多觀光客喜歡買太陽餅送朋友，因為不太貴，而且很好吃。',
  qs:[['一盒太陽餅有幾個？','六個','兩個|十二個'],['今天買兩盒可以得到什麼？','一杯茶','一盒太陽餅|兩百塊'],['觀光客為什麼喜歡買太陽餅？','不太貴，而且很好吃','很便宜，可是不好吃|店很大']]},
 pool:[['v','好吃',"delicious","おいしい",13],['v','喝',"to drink","飲む",13],['v','珍珠奶茶',"bubble milk tea","タピオカミルクティー",14],['v','菜單',"menu","メニュー",14],['v','外帶',"takeout, to go","持ち帰り",15],['v','吃素',"to eat vegetarian","菜食をする",16],
  ['g','我要一＿＿咖啡。','杯','個|本|張',"I want a cup of coffee.","コーヒーを一杯ください。",14],['g','太陽餅很好吃，可是有一點＿＿。','貴','便宜|好|喜歡',"Sun cakes are tasty but a bit pricey.","太陽餅はおいしいけど、ちょっと高い。",15],
  ['l','老闆，我要兩杯珍珠奶茶，外帶。',"Two bubble teas to go, please.","タピオカミルクティー二つ、持ち帰りでお願いします。",14],['l','內用還是外帶？',"For here or to go?","店内ですか、お持ち帰りですか？",15],['l','我不吃肉，我吃素。',"I don't eat meat; I'm vegetarian.","肉は食べません、菜食です。",16]]},
{id:'changhua',zh:'彰化',en:'Changhua',ja:'彰化',x:28.8,y:60,leader:'阿嬌',role:["Bawan shop owner","肉圓屋の店主"],theme:'買東西',roof:'#b5562a',emblem:'buddha',tree:'broad',
 hello:[['彰化肉圓，一個三十五塊！',"Changhua bawan, NT$35 each!","彰化の肉圓、一個三十五元！"],['你會問多少錢嗎？',"Can you ask how much things cost?","「いくら」って聞ける？"]],
 read:{p:'阿嬌在彰化賣肉圓，一個三十五塊，三個一百塊。很多觀光客先去看大佛，再來吃肉圓。今天有一個客人買了五個，阿嬌送他一碗湯。',
  qs:[['三個肉圓多少錢？','一百塊','三十五塊|一百零五塊'],['很多觀光客吃肉圓以前做什麼？','去看大佛','去買衣服|去坐火車'],['今天那個客人得到什麼？','一碗湯','一個肉圓|一百塊']]},
 pool:[['v','買',"to buy","買う",16],['v','錢',"money","お金",17],['v','塊',"dollar (spoken)","元（話し言葉）",17],['v','便宜',"cheap","安い",18],['v','貴',"expensive","高い",18],['v','賣',"to sell","売る",19],
  ['g','這個多少＿＿？','錢','杯|本|點',"How much is this?","これはいくらですか？",17],['g','這件衣服太貴＿＿。','了','嗎|的|很',"This piece of clothing is too expensive.","この服は高すぎます。",19],
  ['l','一個肉圓三十五塊。',"One bawan is NT$35.","肉圓一個三十五元です。",17],['l','可以便宜一點嗎？',"Can you make it a bit cheaper?","少し安くしてもらえますか？",18],['l','我想買兩個，帶回去給家人吃。',"I want two to take home for my family.","二つ買って、家族に持って帰りたいです。",19]]},
{id:'nantou',zh:'南投',en:'Nantou',ja:'南投',x:46,y:68,leader:'邵青',role:["Lake boat captain","湖の船長"],theme:'天氣・自然',roof:'#3a9d8f',emblem:'lake',tree:'pine',
 hello:[['日月潭的水，跟天空一樣藍！',"Sun Moon Lake is as blue as the sky!","日月潭の水は、空と同じくらい青い！"],['今天天氣怎麼樣？',"How's the weather today?","今日の天気はどう？"]],
 read:{p:'日月潭在南投，是臺灣最大的湖。早上的天氣常常很好，可是下午可能會下雨。船長邵青說，來日月潭最好坐船，也可以騎腳踏車。山上比較冷，所以要帶外套。',
  qs:[['日月潭是什麼？','臺灣最大的湖','臺灣最高的山|一個城市'],['下午的天氣可能怎麼樣？','會下雨','很熱|很好'],['為什麼要帶外套？','山上比較冷','船上很熱|外套很便宜']]},
 pool:[['v','山',"mountain","山",19],['v','天氣',"weather","天気",19],['v','下雨',"to rain","雨が降る",19],['v','熱',"hot","暑い",20],['v','冷',"cold","寒い",20],['v','湖',"lake","湖",21],
  ['g','外面在下雨，你最好帶＿＿。','傘','書|茶|錢',"It's raining; you'd better take an umbrella.","雨だから、傘を持っていったほうがいい。",20],['g','今天天氣很＿＿，我們去湖邊走走吧。','好','壞|下雨|冷氣',"The weather is great today; let's walk by the lake.","今日はいい天気だから、湖のほとりを散歩しよう。",21],
  ['l','山上比較冷，要多穿一點。',"It's colder in the mountains; wear more.","山の上は寒いから、多めに着てね。",20],['l','下午可能會下雨。',"It might rain this afternoon.","午後は雨が降るかもしれません。",21],['l','今天的日月潭好漂亮！',"Sun Moon Lake is so beautiful today!","今日の日月潭はとてもきれい！",19]]},
{id:'yunlin',zh:'雲林',en:'Yunlin',ja:'雲林',x:27,y:76,leader:'阿土',role:["Peanut farmer","ピーナッツ農家"],theme:'交通',roof:'#a8752f',emblem:'peanut',tree:'broad',
 hello:[['雲林的花生，又香又脆！',"Yunlin peanuts are fragrant and crunchy!","雲林のピーナッツは香ばしくてサクサク！"],['你今天坐什麼車來的？',"How did you get here today?","今日は何に乗って来たの？"]],
 read:{p:'阿土住在雲林，他每天騎機車去田裡看花生。他的女兒在臺北工作，週末常常坐高鐵回家。坐高鐵很快，可是比較貴，所以有時候她也坐火車。',
  qs:[['阿土怎麼去田裡？','騎機車','開車|坐公車'],['阿土的女兒週末常常做什麼？','坐高鐵回家','去田裡工作|在臺北看書'],['坐高鐵怎麼樣？','很快，可是比較貴','很慢，可是很便宜|很快，也很便宜']]},
 pool:[['v','坐',"to ride (a vehicle)","乗る",22],['v','火車',"train","列車",22],['v','公車',"bus","バス",22],['v','騎機車',"to ride a scooter","バイクに乗る",23],['v','開車',"to drive","車を運転する",23],['v','高鐵',"high-speed rail","高速鉄道",24],
  ['g','我每天＿＿機車去上班。','騎','坐|開|走',"I ride a scooter to work every day.","毎日バイクで通勤しています。",23],['g','坐高鐵＿＿坐火車快。','比','跟|把|被',"High-speed rail is faster than the regular train.","高速鉄道は普通列車より速い。",25],
  ['l','坐高鐵到臺北要一個半小時。',"The HSR to Taipei takes an hour and a half.","高速鉄道で台北まで一時間半かかります。",23],['l','下一班公車十分鐘以後來。',"The next bus comes in ten minutes.","次のバスは十分後に来ます。",24],['l','我騎機車載你去吧。',"I'll give you a ride on my scooter.","バイクで送っていくよ。",25]]},
{id:'chiayico',zh:'嘉義縣',en:'Chiayi County',ja:'嘉義県',x:39,y:86,leader:'阿里',role:["Mountain train driver","登山鉄道の運転士"],theme:'方向・位置',roof:'#3f8f4f',emblem:'sunrise',tree:'pine',
 hello:[['嗚嗚——小火車要開了！',"Toot toot — the little train is leaving!","ポッポー、登山列車が出発するよ！"],['你知道怎麼去車站嗎？',"Do you know how to get to the station?","駅への行き方、分かる？"]],
 read:{p:'阿里很喜歡坐火車。從嘉義車站坐小火車上阿里山，大概要兩個半小時。上山的路很漂亮，有很多樹。到了山上，天氣比較冷，最好帶一件外套。早上四點半，很多人去看日出。',
  qs:[['從嘉義坐小火車上阿里山要多久？','兩個半小時','半個小時|四個半小時'],['山上的天氣怎麼樣？','比較冷','比較熱|常常下雨'],['很多人早上四點半做什麼？','去看日出','坐火車回家|買外套']]},
 pool:[['v','左轉',"turn left","左に曲がる",25],['v','右邊',"right side","右側",25],['v','一直走',"go straight","まっすぐ行く",26],['v','附近',"nearby","近く",26],['v','旁邊',"next to","隣",27],['v','對面',"across from","向かい",27],
  ['g','郵局在銀行＿＿旁邊。','的','了|得|嗎',"The post office is next to the bank.","郵便局は銀行の隣にあります。",26],['g','從這裡＿＿車站要多久？','到','在|給|對',"How long from here to the station?","ここから駅までどのくらいかかりますか？",27],
  ['l','到了第二個路口右轉。',"Turn right at the second intersection.","二つ目の交差点を右に曲がってください。",25],['l','車站就在前面，一直走就到了。',"The station is just ahead; go straight.","駅はすぐ前です、まっすぐ行けば着きます。",26],['l','廁所在餐廳對面。',"The restroom is across from the restaurant.","トイレはレストランの向かいにあります。",27]]},
{id:'chiayi',zh:'嘉義市',en:'Chiayi City',ja:'嘉義市',x:24.8,y:90,leader:'阿娟',role:["Chicken rice cook","鶏肉飯の料理人"],theme:'一天的生活',roof:'#d1603d',emblem:'ricebowl',tree:'broad',
 hello:[['嘉義的雞肉飯，你吃了沒？',"Have you tried Chiayi chicken rice yet?","嘉義の鶏肉飯、もう食べた？"],['我每天早上五點就開店了！',"I open my shop at 5 a.m. every day!","毎朝五時にはもう店を開けているよ！"]],
 read:{p:'阿娟每天早上四點半起床，五點開店。她先煮飯，然後準備雞肉。七點以後，很多學生跟上班族來吃早餐。下午兩點她就關門了，回家睡午覺。',
  qs:[['阿娟幾點開店？','五點','四點半|七點'],['阿娟先做什麼？','煮飯','準備雞肉|睡午覺'],['下午兩點以後阿娟做什麼？','回家睡午覺','開店|吃早餐']]},
 pool:[['v','每天',"every day","毎日",28],['v','已經',"already","もう",28],['v','還沒',"not yet","まだ～ない",28],['v','然後',"and then","それから",29],['v','以後',"after","～の後",29],['v','以前',"before","～の前",30],
  ['g','我＿＿吃過午飯了。','已經','以前|一起|還沒',"I've already had lunch.","もう昼ご飯を食べました。",29],['g','我先洗澡，＿＿睡覺。','然後','已經|以前|還沒',"I shower first, then go to bed.","先にシャワーを浴びて、それから寝ます。",30],
  ['l','你吃飯了嗎？還沒，我等一下吃。',"Have you eaten? Not yet, I'll eat in a bit.","ご飯食べた？まだ、あとで食べる。",28],['l','下課以後，我們去吃雞肉飯吧。',"After class, let's go eat chicken rice.","授業の後、鶏肉飯を食べに行こう。",29],['l','我昨天十二點才睡覺。',"I didn't go to bed until midnight yesterday.","昨日は十二時になってやっと寝ました。",31]]},
{id:'tainan',zh:'臺南',en:'Tainan',ja:'台南',x:14,y:108.5,leader:'老師傅',role:["Veteran snack chef","老舗の料理人"],theme:'經驗（過）',roof:'#b33a2a',emblem:'tower',tree:'palm',
 hello:[['臺南的小吃，我做了五十年了。',"I've made Tainan snacks for fifty years.","台南の屋台料理を作って五十年になる。"],['你去過臺南的古蹟嗎？',"Have you visited Tainan's historic sites?","台南の史跡に行ったことある？"]],
 read:{p:'臺南是臺灣最老的城市，有很多古蹟跟小吃。我去年夏天去過一次，天氣非常熱，每天都超過三十五度。我吃了牛肉湯、虱目魚粥跟豆花。雖然很熱，可是我玩得很開心，明年還想再去。',
  qs:[['作者什麼時候去臺南？','去年夏天','今年冬天|明年夏天'],['那時候天氣怎麼樣？','非常熱','常常下雨|很冷'],['作者明年想做什麼？','再去臺南','在古蹟工作|學做豆花']]},
 pool:[['v','次',"times (occurrences)","～回",31],['v','古蹟',"historic site","史跡",31],['v','小吃',"street food","屋台料理",31],['v','歷史',"history","歴史",32],['v','有名',"famous","有名",32],['v','去過',"have been to","行ったことがある",33],
  ['g','我去＿＿臺南三次。','過','了|著|在',"I've been to Tainan three times.","台南に三回行ったことがあります。",32],['g','你吃過牛肉湯＿＿？','沒有','了|過|著',"Have you ever had beef soup?","牛肉スープを食べたことがありますか？",33],
  ['l','臺南是臺灣最老的城市。',"Tainan is the oldest city in Taiwan.","台南は台湾で一番古い都市です。",31],['l','我以前住過臺南，那裡的小吃很有名。',"I used to live in Tainan; the food there is famous.","以前台南に住んでいました、あそこの屋台料理は有名です。",32],['l','我從來沒去過赤崁樓。',"I've never been to Chihkan Tower.","赤崁楼には一度も行ったことがありません。",33]]},
{id:'kaohsiung',zh:'高雄',en:'Kaohsiung',ja:'高雄',x:18,y:124.7,leader:'海哥',role:["Harbor worker","港の作業員"],theme:'比較',roof:'#1f6f8b',emblem:'anchor',tree:'palm',
 hello:[['高雄港的風，越來越舒服了。',"The harbor breeze keeps getting nicer.","高雄港の風はどんどん心地よくなる。"],['跟我比一比吧！',"Let's compare skills!","勝負しよう！"]],
 read:{p:'海哥在高雄港工作了二十年。他說，以前的高雄比較安靜，現在越來越熱鬧，有輕軌、捷運，還有很多新的藝術中心。不過，他覺得高雄最好的地方還是海。下班以後，他常常把機車停在旗津，一個人看夕陽。',
  qs:[['海哥覺得以前的高雄怎麼樣？','比較安靜','比較熱鬧|沒有海'],['海哥覺得高雄最好的地方是什麼？','海','輕軌|藝術中心'],['下班以後，海哥常常做什麼？','在旗津看夕陽','去港口工作|坐捷運回家']]},
 pool:[['v','比較',"relatively; to compare","比較的に",34],['v','熱鬧',"lively, bustling","にぎやか",34],['v','安靜',"quiet","静か",35],['v','方便',"convenient","便利",35],['v','港口',"harbor","港",36],['v','輕軌',"light rail","ライトレール",36],
  ['g','高雄＿＿臺北熱。','比','跟|把|被',"Kaohsiung is hotter than Taipei.","高雄は台北より暑い。",35],['g','高雄的捷運沒有臺北的＿＿擠。','那麼','比|很|最',"Kaohsiung's MRT isn't as crowded as Taipei's.","高雄のMRTは台北ほど混んでいない。",37],
  ['l','這家店比那家便宜一百塊。',"This shop is NT$100 cheaper than that one.","この店はあの店より百元安い。",34],['l','坐輕軌比騎機車慢，可是比較安全。',"The light rail is slower than a scooter, but safer.","ライトレールはバイクより遅いけど、安全です。",36],['l','高雄越來越熱鬧了。',"Kaohsiung keeps getting livelier.","高雄はどんどんにぎやかになっています。",37]]},
{id:'penghu',zh:'澎湖',en:'Penghu',ja:'澎湖',x:-14,y:84,island:1,leader:'阿漁',role:["Island fisherman","島の漁師"],theme:'打算・計畫',roof:'#2a9fd6',emblem:'hearts',tree:'palm',
 hello:[['澎湖的海，是全臺灣最藍的！',"Penghu's sea is the bluest in all of Taiwan!","澎湖の海は台湾で一番青い！"],['你這次打算玩幾天？',"How many days are you planning to stay?","今回は何日遊ぶ予定？"]],
 read:{p:'阿漁是澎湖的漁夫。他說，夏天來澎湖的遊客最多，因為可以游泳、坐船，晚上還可以看煙火。很多人打算來看有名的「雙心石滬」，那是用石頭做的，看起來像兩顆心。冬天風很大，遊客比較少。',
  qs:[['什麼時候遊客最多？','夏天','冬天|晚上'],['雙心石滬是用什麼做的？','石頭','木頭|魚'],['冬天為什麼遊客比較少？','風很大','沒有船|太熱了']]},
 pool:[['v','打算',"to plan to","～するつもり",37],['v','坐船',"to take a boat","船に乗る",37],['v','海邊',"seaside, beach","海辺",38],['v','游泳',"to swim","泳ぐ",38],['v','計畫',"plan","計画",39],['v','機票',"plane ticket","航空券",39],
  ['g','我＿＿明年夏天去澎湖。','打算','已經|游泳|海邊',"I'm planning to go to Penghu next summer.","来年の夏に澎湖へ行くつもりです。",38],['g','從高雄坐船＿＿澎湖要四個小時。','到','在|把|被',"By boat from Kaohsiung to Penghu takes four hours.","高雄から船で澎湖まで四時間かかります。",39],
  ['l','我們打算明天早上去海邊游泳。',"We plan to swim at the beach tomorrow morning.","明日の朝、海辺で泳ぐつもりです。",38],['l','機票太貴了，我們坐船吧。',"Plane tickets are too expensive; let's take the boat.","航空券が高すぎるから、船にしよう。",39],['l','你看，那兩個石滬看起來像兩顆心。',"Look, those two stone weirs look like two hearts.","見て、あの二つの石垣がハートに見える。",40]]},
{id:'pingtung',zh:'屏東',en:'Pingtung',ja:'屏東',x:31.5,y:139.5,leader:'小琪',role:["Kenting lifeguard","墾丁のライフガード"],theme:'正在・進行',roof:'#f08a24',emblem:'lighthouse',tree:'palm',
 hello:[['我正在墾丁的海邊工作！',"I'm working on Kenting's beach right now!","今、墾丁の海辺で働いているよ！"],['你在做什麼？快來跟我比一比！',"What are you up to? Come compete with me!","何してるの？早く勝負しよう！"]],
 read:{p:'小琪在墾丁當救生員。夏天的時候，海邊總是很熱鬧：有人正在衝浪，有人在曬太陽，也有小朋友在玩沙。小琪說，太陽很大的時候一定要擦防曬，也要多喝水。下班以後，她喜歡去鵝鑾鼻燈塔看海。',
  qs:[['小琪的工作是什麼？','救生員','老師|導遊'],['太陽很大的時候要做什麼？','擦防曬，多喝水','去衝浪|去燈塔'],['下班以後小琪喜歡做什麼？','去燈塔看海','在海邊工作|玩沙']]},
 pool:[['v','正在',"in the middle of (doing)","～している最中",40],['v','衝浪',"to surf","サーフィンする",40],['v','太陽',"sun","太陽",40],['v','燈塔',"lighthouse","灯台",41],['v','曬',"to bask in the sun","日に当たる",41],['v','防曬',"sunscreen","日焼け止め",42],
  ['g','他＿＿衝浪，現在不能接電話。','正在','已經|以前|還是',"He's surfing now and can't answer the phone.","彼は今サーフィン中で、電話に出られません。",41],['g','太陽很大，記得擦＿＿。','防曬','燈塔|衝浪|海邊',"The sun is strong; remember sunscreen.","日差しが強いから、日焼け止めを塗ってね。",42],
  ['l','你在做什麼？我在等公車。',"What are you doing? I'm waiting for the bus.","何してるの？バスを待っています。",40],['l','他們正在海邊衝浪。',"They are surfing at the beach.","彼らは今海辺でサーフィンをしています。",41],['l','鵝鑾鼻燈塔在臺灣最南邊。',"Eluanbi Lighthouse is at Taiwan's southern tip.","ガランピ灯台は台湾の最南端にあります。",42]]},
{id:'taitung',zh:'臺東',en:'Taitung',ja:'台東',x:55.8,y:118.8,leader:'小晴',role:["Hot-air balloon pilot","熱気球のパイロット"],theme:'感覺・身體',roof:'#7a4fb3',emblem:'balloon',tree:'palm',
 hello:[['你看，熱氣球要飛起來了！',"Look, the balloons are taking off!","見て、熱気球が飛び立つよ！"],['雖然有一點緊張，但是我們一起加油吧！',"I'm a bit nervous, but let's do our best!","ちょっと緊張するけど、一緒にがんばろう！"]],
 read:{p:'每年夏天，臺東鹿野都有熱氣球節。小晴第一次坐熱氣球的時候很緊張，雖然只飛了十分鐘，但是她看到了很美的風景：綠色的稻田、遠遠的山，還有藍藍的天空。下來以後，她的手機被朋友拿去拍了很多照片。',
  qs:[['熱氣球節在什麼時候？','每年夏天','每年冬天|每個週末'],['小晴第一次坐熱氣球覺得怎麼樣？','很緊張','很無聊|很累'],['小晴的手機怎麼了？','被朋友拿去拍照','掉在稻田裡|忘在山上']]},
 pool:[['v','醫生',"doctor","医者",43],['v','舒服',"comfortable; feel well","気持ちいい",43],['v','緊張',"nervous","緊張する",43],['v','累',"tired","疲れた",44],['v','感冒',"to catch a cold","風邪をひく",44],['v','熱氣球',"hot-air balloon","熱気球",45],
  ['g','我頭很痛，可能＿＿了。','感冒','放鬆|舒服|高興',"My head hurts; I may have caught a cold.","頭が痛い、風邪をひいたかもしれない。",44],['g','第一次坐熱氣球，我覺得有一點＿＿。','緊張','醫生|風景|天氣',"Riding a balloon for the first time, I feel a bit nervous.","初めて熱気球に乗るので、ちょっと緊張しています。",45],
  ['l','醫生說我要多喝水，多休息。',"The doctor said to drink more water and rest.","医者に水をたくさん飲んでよく休むように言われました。",44],['l','你臉色不太好，是不是不舒服？',"You look pale. Are you not feeling well?","顔色が悪いけど、具合が悪いの？",45],['l','看到熱氣球飛起來的時候，我好感動。',"When I saw the balloons rise, I was so moved.","熱気球が飛び上がるのを見て、とても感動しました。",46]]},
{id:'hualien',zh:'花蓮',en:'Hualien',ja:'花蓮',x:76.5,y:63.9,leader:'達卡',role:["Truku tour guide","タロコ族のガイド"],theme:'不但・連',roof:'#4a6a3a',emblem:'gorge',tree:'pine',
 hello:[['歡迎來到太魯閣！',"Welcome to Taroko!","タロコへようこそ！"],['這裡不但風景美，而且故事很多。',"The scenery here is beautiful, and there are many stories too.","ここは景色が美しいだけでなく、物語もたくさんあるんだ。"]],
 read:{p:'達卡是太魯閣族人，他在花蓮當導遊。他說，來太魯閣不但可以看到很壯觀的峽谷，而且可以了解原住民的文化。很多遊客一到花蓮就想去太魯閣，可是他建議大家先查天氣，因為下大雨的時候，連最有經驗的導遊都不會帶人上山。',
  qs:[['達卡的工作是什麼？','導遊','老師|司機'],['來太魯閣可以做什麼？','看峽谷，了解原住民文化','只能看海|買很多衣服'],['達卡建議遊客先做什麼？','查天氣','訂民宿|找導遊']]},
 pool:[['v','峽谷',"gorge, canyon","峡谷",46],['v','導遊',"tour guide","ガイド",46],['v','壯觀',"magnificent","壮観",47],['v','原住民',"Indigenous peoples","原住民",47],['v','文化',"culture","文化",48],['v','不但',"not only","～だけでなく",48],
  ['g','太魯閣＿＿漂亮，而且很壯觀。','不但','雖然|因為|連',"Taroko is not only beautiful but also magnificent.","タロコは美しいだけでなく、壮観だ。",47],['g','他忙得＿＿午飯都沒吃。','連','不但|就|把',"He was so busy he didn't even eat lunch.","彼は忙しくて昼ご飯さえ食べていない。",49],
  ['l','這裡不但風景美，而且東西也好吃。',"The scenery is beautiful, and the food is good too.","ここは景色がきれいなだけでなく、食べ物もおいしい。",47],['l','連小孩子都知道這個故事。',"Even kids know this story.","子どもでさえこの話を知っています。",48],['l','下大雨的時候不要上山。',"Don't go up the mountain in heavy rain.","大雨のときは山に登らないでください。",49]]},
{id:'yilan',zh:'宜蘭',en:'Yilan',ja:'宜蘭',x:83.3,y:31,leader:'阿德',role:["Scallion farmer","ネギ農家"],theme:'把字句',roof:'#4f9d4a',emblem:'turtle',tree:'broad',
 hello:[['宜蘭的三星蔥，又香又甜！',"Yilan's Sanxing scallions are fragrant and sweet!","宜蘭の三星ネギは香りがよくて甘い！"],['先把這些問題回答完吧！',"First, finish answering these questions!","まずはこれらの問題に答えてもらおう！"]],
 read:{p:'宜蘭有山、有海，還有溫泉。阿德每天早上去田裡拔蔥，然後把蔥洗好，放在車上，送到市場去賣。下午他喜歡去礁溪泡溫泉。他說，泡溫泉以前要先把身體洗乾淨。',
  qs:[['阿德把蔥送到哪裡？','市場','溫泉|海邊'],['阿德下午喜歡做什麼？','泡溫泉','拔蔥|去海邊'],['泡溫泉以前要做什麼？','先把身體洗乾淨','先吃飯|先睡覺']]},
 pool:[['v','把',"(marks the object being handled)","「～を」処置文",49],['v','蔥',"scallion","ネギ",49],['v','洗',"to wash","洗う",49],['v','溫泉',"hot spring","温泉",50],['v','放',"to put, place","置く",50],['v','關',"to close; turn off","閉める・消す",50],
  ['g','請你＿＿門關上。','把','被|比|從',"Please close the door.","ドアを閉めてください。",50],['g','我把蔥洗＿＿了。','好','過|著|在',"I've finished washing the scallions.","ネギを洗い終わりました。",51],
  ['l','請把你的護照給我看一下。',"Please let me see your passport.","パスポートを見せてください。",50],['l','你可以把冷氣關掉嗎？',"Could you turn off the air conditioner?","エアコンを消してもらえますか？",51],['l','泡完溫泉，把頭髮吹乾再睡覺。',"After the hot spring, dry your hair before bed.","温泉の後は、髪を乾かしてから寝てね。",52]]},
{id:'keelung',zh:'基隆',en:'Keelung',ja:'基隆',x:82.8,y:12.2,leader:'小雨',role:["Night-market vendor","夜市の店主"],theme:'被字句',roof:'#5a6bb5',emblem:'umbrella',tree:'broad',
 hello:[['基隆是雨港，常常下雨。',"Keelung is the Rain Port; it rains a lot.","基隆は雨の港、よく雨が降るの。"],['我的傘又被風吹走了！',"My umbrella got blown away again!","また傘が風に飛ばされちゃった！"]],
 read:{p:'基隆一年有很多天在下雨，所以叫「雨港」。小雨在廟口夜市賣天婦羅。有一天風很大，她的傘被吹走了，衣服也被雨淋濕了。可是客人還是很多，晚上九點東西就被買光了。',
  qs:[['基隆為什麼叫「雨港」？','常常下雨','有很多傘|有很多船'],['小雨的傘怎麼了？','被風吹走了','被客人買走了|被偷了'],['晚上九點發生了什麼事？','東西被買光了','開始下雨|夜市關門了']]},
 pool:[['v','被',"(passive marker)","受け身「～される」",52],['v','偷',"to steal","盗む",52],['v','港',"port","港",52],['v','夜市',"night market","夜市",52],['v','吹',"to blow","吹く",53],['v','淋濕',"to get soaked","びしょ濡れになる",53],
  ['g','我的蛋糕＿＿妹妹吃了。','被','把|比|從',"My cake was eaten by my little sister.","私のケーキは妹に食べられた。",53],['g','衣服被雨＿＿了。','淋濕','吹走|偷走|關上',"The clothes got soaked by the rain.","服が雨でびしょ濡れになった。",54],
  ['l','我的錢包被偷了！',"My wallet was stolen!","財布を盗まれた！",53],['l','我的傘被風吹走了。',"My umbrella was blown away by the wind.","傘が風に飛ばされた。",54],['l','夜市的東西都被吃光了。',"Everything at the night market got eaten up.","夜市の食べ物は全部食べ尽くされた。",55]]},
{id:'newtaipei',zh:'新北',en:'New Taipei',ja:'新北',x:86,y:20,leader:'小芬',role:["Jiufen teahouse owner","九份の茶館の店主"],theme:'雖然・如果',roof:'#a3302b',emblem:'lantern',tree:'broad',
 hello:[['九份的紅燈籠，晚上最漂亮。',"Jiufen's red lanterns are prettiest at night.","九份の赤い提灯は夜が一番きれい。"],['雖然路很陡，但是風景很值得！',"The road is steep, but the view is worth it!","坂は急だけど、景色はその価値があるよ！"]],
 read:{p:'九份在新北的山上，以前是挖金子的地方。雖然路很小，人也很多，但是每天還是有很多遊客。小芬在九份開茶館，她說：「如果你晚上來，就可以看到紅燈籠跟遠遠的海。」',
  qs:[['九份以前是什麼地方？','挖金子的地方','賣茶的地方|一個港口'],['九份的路怎麼樣？','很小，人很多','很大，人很少|沒有路'],['晚上來九份可以看到什麼？','紅燈籠跟海','日出|熱氣球']]},
 pool:[['v','雖然',"although","～だけれども",55],['v','但是',"but","しかし",55],['v','如果',"if","もし",56],['v','燈籠',"lantern","提灯",56],['v','茶館',"teahouse","茶館",56],['v','值得',"worth it","～する価値がある",57],
  ['g','＿＿下雨了，但是我們還是去九份。','雖然','因為|所以|如果',"Although it rained, we still went to Jiufen.","雨が降ったけれど、それでも九份に行った。",56],['g','如果明天天氣好，我們＿＿去爬山。','就','才|都|還',"If the weather is good tomorrow, we'll go hiking.","もし明日天気が良ければ、山に登ろう。",57],
  ['l','雖然我很累，但是我很開心。',"I'm tired, but I'm happy.","疲れたけど、とても楽しかった。",55],['l','如果你有空，就來茶館喝茶吧。',"If you're free, come have tea at the teahouse.","時間があれば、茶館にお茶を飲みに来てね。",56],['l','九份人很多，但是很值得去。',"Jiufen is crowded, but it's worth going.","九份は人が多いけど、行く価値がある。",57]]},
{id:'taipei',zh:'臺北',en:'Taipei',ja:'台北',x:74.7,y:14,leader:'小安',role:["MRT station staff","MRTの駅員"],theme:'都市生活',roof:'#d8402f',emblem:'tower101',tree:'broad',
 hello:[['我是捷運站的小安！',"I'm An from the MRT station!","MRT駅のアンだよ！"],['臺北的生活越來越快，你跟得上嗎？',"Life in Taipei keeps getting faster. Can you keep up?","台北の生活はどんどん速くなる、ついてこられる？"]],
 read:{p:'小安在臺北捷運站工作。每天早上七點到九點，捷運站裡的人越來越多，大家都很忙。小安說，臺北的生活很方便，可是也很快。他放假的時候，喜歡坐捷運去象山，從山上看臺北一零一。',
  qs:[['捷運站什麼時候人最多？','早上七點到九點','中午|晚上十點以後'],['小安覺得臺北的生活怎麼樣？','很方便，可是也很快','很慢，可是很安靜|不方便'],['放假的時候小安喜歡做什麼？','去象山看臺北一零一','在捷運站工作|去海邊']]},
 pool:[['v','捷運',"MRT, metro","MRT（地下鉄）",58],['v','上班',"to go to work","出勤する",58],['v','加班',"to work overtime","残業する",58],['v','擠',"crowded","混んでいる",59],['v','越來越',"more and more","ますます",59],['v','習慣',"to be used to","慣れる",60],
  ['g','我的中文＿＿好了。','越來越','把|比|被',"My Chinese is getting better and better.","私の中国語はますます上手になった。",59],['g','我剛搬到臺北，還不太＿＿。','習慣','方便|加班|上班',"I just moved to Taipei and I'm not used to it yet.","台北に引っ越したばかりで、まだあまり慣れていません。",60],
  ['l','早上的捷運好擠喔！',"The MRT is so crowded in the morning!","朝のMRTはすごく混んでいる！",58],['l','我今天要加班，晚一點回家。',"I have to work late today; I'll be home late.","今日は残業だから、帰りが遅くなる。",59],['l','臺北一零一是臺北最有名的大樓。',"Taipei 101 is Taipei's most famous building.","台北101は台北で一番有名なビルです。",60]]},
{id:'kinmen',zh:'金門',en:'Kinmen',ja:'金門',x:-16,y:44,island:1,leader:'阿獅',role:["Wind Lion God keeper","風獅爺の守り人"],theme:'之所以・歷史',roof:'#c8862e',emblem:'windlion',tree:'pine',
 hello:[['風獅爺保護金門已經幾百年了。',"The Wind Lion Gods have guarded Kinmen for centuries.","風獅爺は何百年も金門を守ってきた。"],['金門之所以特別，是因為它的歷史。',"Kinmen is special because of its history.","金門が特別なのは、その歴史のおかげだ。"]],
 read:{p:'金門離中國大陸很近，以前發生過戰爭。現在金門很和平，有很多傳統的閩南建築。金門人之所以在村子裡放風獅爺，是因為以前風很大，他們希望風獅爺可以保護大家。',
  qs:[['金門以前發生過什麼事？','戰爭','颱風|地震'],['現在的金門怎麼樣？','很和平','很危險|沒有人住'],['為什麼要放風獅爺？','希望保護大家','因為很好看|要賣給遊客']]},
 pool:[['v','之所以',"the reason why","～のは（～だからだ）",61],['v','保護',"to protect","守る",61],['v','傳統',"tradition","伝統",62],['v','建築',"architecture","建築",62],['v','戰爭',"war","戦争",63],['v','和平',"peace","平和",63],
  ['g','他＿＿成功，是因為他每天都練習。','之所以','不但|雖然|與其',"The reason he succeeded is that he practiced every day.","彼が成功したのは、毎日練習したからだ。",62],['g','金門有很多傳統的閩南＿＿。','建築','戰爭|和平|保護',"Kinmen has many traditional Minnan-style buildings.","金門には伝統的な閩南建築がたくさんある。",63],
  ['l','風獅爺是用來保護村子的。',"The Wind Lion God protects the village.","風獅爺は村を守るためのものです。",61],['l','以前這裡有戰爭，現在很和平。',"There was war here before; now it's peaceful.","昔ここでは戦争があったが、今はとても平和だ。",62],['l','金門的貢糖很有名，可以買回去送朋友。',"Kinmen peanut candy is famous; buy some for friends.","金門の貢糖は有名だから、お土産に買って帰れる。",63]]},
{id:'matsu',zh:'連江',en:'Lienchiang (Matsu)',ja:'連江（馬祖）',x:-16,y:6,island:1,leader:'小藍',role:["Blue Tears guide","「青い涙」のガイド"],theme:'儘管・既然・與其',roof:'#2c4f9e',emblem:'bluetears',tree:'pine',
 hello:[['馬祖的藍眼淚，只有晚上看得到。',"Matsu's Blue Tears glow only at night.","馬祖の「青い涙」は夜にしか見られない。"],['既然你來到最後一個道館，就讓我看看你的實力吧！',"Since you've reached the final gym, show me what you've got!","最後のジムまで来たのなら、実力を見せてもらおう！"]],
 read:{p:'馬祖在臺灣的北邊，有很多小島。每年四月到八月的晚上，海邊會出現發光的「藍眼淚」。儘管要坐很久的船，還是有很多遊客來看。小藍說：「與其看照片，不如自己來看一次。」',
  qs:[['什麼時候可以看到藍眼淚？','四月到八月的晚上','冬天的早上|每天中午'],['去馬祖要怎麼樣？','坐很久的船','走路|坐高鐵'],['小藍的意思是什麼？','自己來看比看照片好','看照片就夠了|不要來馬祖']]},
 pool:[['v','島',"island","島",64],['v','儘管',"despite","～にもかかわらず",64],['v','既然',"since (given that)","～である以上",64],['v','與其',"rather than","～よりも",65],['v','不如',"would be better to","～したほうがいい",65],['v','發光',"to glow","光る",66],
  ['g','＿＿天氣不好，船仍然照常出發。','儘管','因為|只要|除非',"Despite the bad weather, the boat left as usual.","天気が悪いにもかかわらず、船は通常通り出発した。",65],['g','＿＿在家抱怨，不如出去走走。','與其','儘管|既然|即使',"Rather than complain at home, go out for a walk.","家で文句を言うより、散歩に出たほうがいい。",66],
  ['l','既然來了馬祖，就一定要看藍眼淚。',"Since you're in Matsu, you must see the Blue Tears.","馬祖に来た以上、絶対に青い涙を見なきゃ。",64],['l','與其坐飛機，不如坐船看海。',"Rather than fly, take the boat and see the sea.","飛行機に乗るより、船で海を見るほうがいい。",65],['l','儘管晚上很冷，大家還是在海邊等。',"Though the night was cold, everyone waited by the sea.","夜は寒かったけれど、みんな海辺で待っていた。",66]]}
];
// 語言大聯盟：六級，對應 TOCFL 華語文能力測驗等級
const LEAGUE=[
 {zh:'入門級',en:"Level 1 · Novice",ja:"レベル1・入門",judge:'阿明',from:[0,4]},
 {zh:'基礎級',en:"Level 2 · Basic",ja:"レベル2・基礎",judge:'小美',from:[5,9]},
 {zh:'進階級',en:"Level 3 · Intermediate",ja:"レベル3・中級",judge:'王教授',from:[10,13]},
 {zh:'高階級',en:"Level 4 · High-intermediate",ja:"レベル4・中上級",judge:'陳主播',from:[14,17]},
 {zh:'流利級',en:"Level 5 · Advanced",ja:"レベル5・上級",judge:'林作家',from:[18,21]},
 {zh:'精通級',en:"Level 6 · Proficient",ja:"レベル6・最上級",judge:'黃館長',pool:[
  ['v','入境隨俗',"when in Rome, do as the Romans do","郷に入っては郷に従え",72],['v','一舉兩得',"two benefits from one action","一挙両得",72],['v','不可思議',"unbelievable","不思議だ・信じられない",73],['v','一言為定',"it's a deal","約束だよ",73],['v','事半功倍',"twice the result with half the effort","半分の労力で倍の成果",74],
  ['g','＿＿你已經決定了，我就不再說什麼了。','既然','與其|儘管|之所以',"Since you've decided, I won't say anything more.","もう決めたのなら、これ以上何も言わない。",74],
  ['l','這個方法不但省錢，而且省時間，真是一舉兩得。',"This method saves money and time: two birds, one stone.","この方法はお金も時間も節約できて、まさに一挙両得だ。",74],
  ['l','好，一言為定，下個月我們在花蓮見！',"OK, it's a deal. See you in Hualien next month!","よし、約束だ。来月花蓮で会おう！",73],
  ['l','用對方法學習，可以事半功倍。',"With the right method, you get more done with less effort.","正しい方法で勉強すれば、半分の労力で倍の成果が出る。",75]]}
];
const ANIMALS=[
 {id:'cat',zh:'貓',en:"Cat",ja:"ネコ",minCity:0,w:5,ab:["Cat instinct: remove one wrong option per battle","ネコの勘：各バトルで不正解を一つ消せる"],pack:'居家',
  items:[['v','沙發',"sofa","ソファ"],['v','睡覺',"to sleep","寝る"],['v','窗戶',"window","窓"],['v','魚',"fish","魚"],
   ['g','這隻貓很可愛，我很喜歡＿＿。','牠','他|她|它',"This cat is cute; I like it a lot. (牠 is for animals.)","この猫はかわいくて大好き。（動物には「牠」を使う）"],
   ['l','我的貓喜歡在沙發上睡覺。',"My cat likes to sleep on the sofa.","うちの猫はソファで寝るのが好き。"]]},
 {id:'dog',zh:'狗',en:"Dog",ja:"イヌ",minCity:0,w:5,ab:["Loyal buddy: +20% EXP","忠実な相棒：経験値+20%"],pack:'戶外',
  items:[['v','散步',"to take a walk","散歩する"],['v','公園',"park","公園"],['v','跑步',"to jog","ジョギングする"],['v','聽話',"obedient","言うことを聞く"],
   ['g','我每天帶狗去公園＿＿。','散步','睡覺|上課|買菜',"I walk the dog in the park every day.","毎日犬を公園に散歩に連れていく。"],
   ['l','你的狗好聽話喔！',"Your dog is so obedient!","あなたの犬、すごくお利口だね！"]]},
 {id:'bird',zh:'麻雀',en:"Sparrow",ja:"スズメ",minCity:2,w:4,ab:["Good ears: slow replay for listening","いい耳：リスニングをゆっくり再生"],pack:'聲音',
  items:[['v','唱歌',"to sing","歌う"],['v','聲音',"sound, voice","音・声"],['v','天空',"sky","空"],['v','飛',"to fly","飛ぶ"],
   ['l','你聽，外面的鳥在唱歌。',"Listen, the birds outside are singing.","聞いて、外で鳥が歌っている。"],
   ['l','早上的空氣很好，鳥也起得很早。',"The morning air is fresh, and the birds rise early.","朝の空気はきれいで、鳥も早起きだ。"]]},
 {id:'leopard',zh:'石虎',en:"Leopard cat",ja:"ベンガルヤマネコ",minCity:3,w:2,ab:["Forest guardian: +15 max stamina","森の守り神：スタミナ上限+15"],pack:'自然',
  items:[['v','森林',"forest","森"],['v','保護',"to protect","守る"],['v','危險',"dangerous","危険"],['v','動物',"animal","動物"],
   ['g','石虎是需要＿＿的動物。','保護','危險|森林|休息',"The leopard cat is an animal that needs protection.","ベンガルヤマネコは保護が必要な動物だ。"]]},
 {id:'magpie',zh:'臺灣藍鵲',en:"Formosan blue magpie",ja:"ヤマムスメ",minCity:6,w:1.5,ab:["Lucky bird: +30% travel money","幸運の鳥：旅費+30%"],pack:'成語',
  items:[['v','自由自在',"free and unfettered","自由気まま"],['v','鳥語花香',"birds singing, flowers blooming","鳥がさえずり花が香る"],['v','一路順風',"have a good trip","道中ご無事で"],
   ['l','祝你一路順風！',"Have a safe trip!","道中ご無事で！"]]},
 {id:'bear',zh:'臺灣黑熊',en:"Formosan black bear",ja:"タイワンツキノワグマ",minCity:14,w:1,ab:["Bear hug: wrong answers cost 25% less stamina","クマの守り：ミスのスタミナ消費25%減"],pack:'山林',
  items:[['v','黑熊',"black bear","ツキノワグマ"],['v','爬山',"to hike up a mountain","山に登る"],['v','小心',"be careful","気をつける"],
   ['l','上山的時候要小心黑熊。',"Watch out for black bears in the mountains.","山に登るときはクマに気をつけて。"]]}
];
// 訓練家與草叢人物：zh, en, ja, 開場白, 輸了的話
const TRAINERS=[
 {zh:'大學生',en:"College student",ja:"大学生",hair:'#3b2a1a',top:'#3a7bd5',style:'short',
  hi:['我在練習教中文，可以問你幾個問題嗎？',"I'm practicing teaching Chinese. Can I ask you a few questions?","中国語を教える練習中なんだ。いくつか質問してもいい？"],lose:['你的中文好棒！',"Your Chinese is great!","中国語、すごく上手だね！"]},
 {zh:'上班族',en:"Office worker",ja:"会社員",hair:'#1d1d1d',top:'#3c4a63',style:'short',
  hi:['等一下要開會，先跟你比一比！',"I have a meeting soon. Quick match first!","この後会議なんだ、その前に勝負だ！"],lose:['我要遲到了……',"I'm going to be late…","遅刻しちゃう……"]},
 {zh:'阿嬤',en:"Grandma",ja:"おばあちゃん",hair:'#d9d4c7',top:'#7a4fb3',style:'bun',
  hi:['吃飽沒？來，阿嬤考考你。',"Have you eaten? Come, let Grandma quiz you.","ご飯食べた？さあ、おばあちゃんが問題を出すよ。"],lose:['真乖，阿嬤請你吃糖。',"Good kid. Here, have a candy.","えらいね、飴をあげよう。"]},
 {zh:'阿伯',en:"Uncle",ja:"おじさん",hair:'#a9a59a',top:'#2f9a74',style:'short',
  hi:['少年仔，跟阿伯比一下！',"Hey kid, take on this old uncle!","若いの、おじさんと勝負だ！"],lose:['哎呀，輸給你了。',"Aiya, you beat me.","あいやー、負けたよ。"]},
 {zh:'外送員',en:"Delivery rider",ja:"配達員",hair:'#141210',top:'#d8402f',style:'cap',
  hi:['等一下，我先考你一題再送餐！',"Hold on, one quiz before I deliver!","待って、配達の前に一問勝負！"],lose:['餐要冷了，我先走了！',"The food's getting cold, gotta go!","料理が冷めちゃう、行かなきゃ！"]},
 {zh:'高中生',en:"High schooler",ja:"高校生",hair:'#2a1d18',top:'#f2efe4',style:'pony',
  hi:['我今天考試考得很好，我們來比！',"I aced my test today. Let's battle!","今日のテスト良かったんだ、勝負しよう！"],lose:['回家要再念書了。',"Back to studying at home.","帰ったらまた勉強しなきゃ。"]},
 {zh:'登山客',en:"Hiker",ja:"登山者",hair:'#4a2a1a',top:'#e0902b',style:'cap',
  hi:['爬山前先暖身，跟我比一比！',"Warm up before the climb. Battle me!","登山前のウォーミングアップ、勝負だ！"],lose:['你比山還難爬！',"You're tougher than the mountain!","君は山より手強い！"]},
 {zh:'觀光客',en:"Tourist",ja:"観光客",hair:'#c8913a',top:'#57b4a8',style:'pony',
  hi:['我也在學中文！我們來比一比吧！',"I'm learning Chinese too! Let's compete!","私も中国語を勉強中！勝負しよう！"],lose:['你學得比我快！',"You're learning faster than me!","私より上達が早いね！"]},
 {zh:'夜市老闆',en:"Night-market vendor",ja:"夜市の店主",hair:'#1d1d1d',top:'#e86f4a',style:'short',
  hi:['來喔來喔！答對了算你便宜！',"Step right up! Get it right and I'll give you a deal!","いらっしゃい！正解したら安くするよ！"],lose:['好啦好啦，算你厲害！',"Fine, fine, you're good!","はいはい、あんたの勝ちだ！"]}
];
const INTRO=[
 ['歡迎來到臺灣！我是林老師。',"Welcome to Taiwan! I'm Teacher Lin.","台湾へようこそ！私は林先生です。"],
 ['你的旅程從桃園開始，逆時針繞臺灣一圈。',"Your journey starts in Taoyuan and circles Taiwan counterclockwise.","旅は桃園から始まり、反時計回りに台湾を一周します。"],
 ['臺灣有二十二個縣市，每個縣市都有一間語言道館。',"Taiwan has 22 counties and cities, each with a language gym.","台湾には22の県市があり、それぞれに言語ジムがあります。"],
 ['在草叢裡，你會遇到很多人跟動物。路上的訓練家看到你，也會來挑戰！',"In the grass you'll meet people and animals. Trainers on the road will challenge you too!","草むらでは人や動物に出会えます。道のトレーナーも勝負を挑んできます！"],
 ['答錯會累，疲勞度用完的話，就會被送回旅館。',"Wrong answers wear you out. Run out of stamina and you'll be sent back to the inn.","間違えると疲れます。スタミナが尽きると旅館に戻されます。"],
 ['拿到二十二個徽章，就可以參加語言大聯盟。加油！',"Collect all 22 badges to enter the Language League. 加油!","バッジを22個集めたら言語大リーグに挑戦できます。がんばって！"]
];
// UI 文字：中文會依設定顯示拼音／注音／不顯示
const UI={
 menu:['選單',"Menu","メニュー"],map:['臺灣地圖',"Map","台湾マップ"],party:['夥伴',"Companions","仲間"],bag:['背包',"Bag","バッグ"],badges:['徽章',"Badges","バッジ"],dex:['華語圖鑑',"Word dex","単語図鑑"],settings:['設定',"Settings","設定"],save:['存檔',"Save","セーブ"],saved:['已存檔',"Saved","セーブしました"],
 close:['關閉',"Close","閉じる"],back:['返回',"Back","戻る"],fatigue:['疲勞度',"Stamina","スタミナ"],start:['開始',"Start","スタート"],run:['逃跑',"Run","にげる"],next:['繼續',"Next","次へ"],toMap:['回到地圖',"Back to map","マップに戻る"],
 correct:['答對了！',"Correct!","正解！"],wrong:['答錯了……',"Not quite.","不正解……"],play:['播放',"Play","再生"],slow:['慢速',"Slow","ゆっくり"],
 whatHear:['你聽到了什麼？',"What did you hear?","何が聞こえましたか？"],whichHeard:['你聽到的是哪一句？',"Which sentence did you hear?","聞こえたのはどの文？"],whatMean:['這是什麼意思？',"What does it mean?","どういう意味？"],whichOne:['哪一個是對的？',"Which word matches?","どれが合っている？"],fill:['選出正確的詞',"Fill in the blank","空欄に入る言葉"],
 reading:['閱讀測驗',"Reading","読解"],listening:['聽力測驗',"Listening","リスニング"],
 noVoice:['這台裝置沒有臺灣華語語音，所以改顯示文字（經驗減半）。',"No Taiwan Mandarin voice on this device, so the sentence is shown instead (half EXP).","この端末には台湾華語の音声がないため、文を表示します（経験値半分）。"],
 tooEasy:['太簡單了，經驗變少',"Too easy: less EXP","簡単すぎ：経験値ダウン"],bonus:['挑戰成功，額外經驗！',"Tough one: bonus EXP!","難問クリア：経験値ボーナス！"],levelUp:['升級了！',"Level up!","レベルアップ！"],
 tired:['疲勞度',"stamina","スタミナ"],faint:['你累倒了……',"You're exhausted…","力尽きた……"],faintMsg:['你被送回旅館休息。',"You were taken back to the inn to rest.","旅館に運ばれて休んだ。"],
 inn:['旅館',"Inn","旅館"],rest:['休息',"Rest","休む"],store:['超商',"Convenience store","コンビニ"],tea:['茶飲店',"Tea stand","ドリンクスタンド"],temple:['廟',"Temple","廟"],house:['民宅',"House","民家"],gym:['道館',"Gym","ジム"],
 buy:['買東西',"Buy","買う"],use:['使用',"Use","使う"],leave:['離開',"Leave","立ち去る"],answer:['回答問題',"Answer","問題に答える"],feed:['餵零食',"Feed a treat","おやつをあげる"],
 snack:['寵物零食',"Pet treat","ペットのおやつ"],drink:['能量飲料',"Energy drink","エナジードリンク"],bubble:['珍珠奶茶',"Bubble tea","タピオカミルクティー"],
 league:['語言大聯盟',"Language League","言語大リーグ"],newGame:['開始新旅程',"New journey","新しい旅を始める"],cont:['繼續旅程',"Continue","続きから"],name:['你的名字',"Your name","あなたの名前"],
 ruby:['標音',"Reading aid","読み方"],pinyin:['拼音',"Pinyin","ピンイン"],zhuyin:['注音',"Zhuyin","注音"],off:['不顯示',"Off","表示しない"],lang:['說明語言',"Help language","説明の言語"],
 voice:['臺灣華語語音',"Taiwan Mandarin voice","台湾華語の音声"],speed:['語速',"Speed","速さ"],reset:['重新開始',"New game","はじめから"],locked:['未解鎖',"Locked","未開放"],
 wildPerson:['草叢裡跳出來了！',"Someone jumped out of the grass!","草むらから誰かが飛び出してきた！"],wildAnimal:['野生動物出現了！',"A wild animal appeared!","野生の動物が現れた！"],trainer:['訓練家想要對戰！',"A trainer wants to battle!","トレーナーが勝負をしかけてきた！"],
 won:['你贏了！',"You won!","勝った！"],lost:['下次再加油！',"Better luck next time!","次はがんばろう！"],tamed:['馴養成功！',"Tamed!","なかよくなった！"],affection:['好感',"Affection","なつき度"],fled:['跑走了！',"It ran away!","逃げてしまった！"],
 needBadge:['要先拿到這個城市的徽章，才能往下一站走喔！',"You need this city's badge before heading on.","この町のバッジがないと先へ進めません。"],
 houseLocked:['這是別人的家，不能隨便進去喔。',"It's someone's home. You can't just walk in.","人の家だよ。勝手に入っちゃだめ。"],
 recLv:['建議等級',"Recommended level","推奨レベル"],trialRead:['第一個試煉：閱讀',"Trial 1: Reading","試練1：読解"],trialListen:['第二個試煉：聽力',"Trial 2: Listening","試練2：リスニング"],
 trialRule:['每個試煉三題，答對兩題以上就過關。',"Three questions per trial; get two right to pass.","各試練3問、2問以上正解で合格。"],trainMore:['再去草叢修練一下吧！',"Train more in the grass and come back!","草むらでもう少し修行してきて！"],
 owned:['持有',"Owned","所持"],fee:['費用',"Fee","料金"],notEnough:['錢不夠',"Not enough money","お金が足りない"],recovered:['疲勞恢復了！',"Stamina restored!","スタミナが回復した！"],
 fortune:['求籤',"Draw a fortune","おみくじ"],pray:['拜拜・存檔',"Pray & save","お参り・セーブ"],here:['目前位置',"You are here","現在地"],champion:['冠軍',"Champion","チャンピオン"],
 pass:['通過！',"Passed!","合格！"],fail:['沒有通過',"Not passed","不合格"],nextTier:['下一關',"Next tier","次の段階"],needAll:['需要二十二個徽章',"Needs all 22 badges","バッジ22個が必要"],
 badgeGet:['得到了徽章！',"Badge earned!","バッジをゲット！"],exitBack:['往上一站',"To previous city","前の町へ"],exitNext:['往下一站',"To next city","次の町へ"],airport:['這裡是機場，你的旅程從這裡開始！',"This is the airport, where your journey begins!","ここは空港、旅はここから始まる！"],
 leagueGate:['前面就是語言大聯盟！打開地圖就能前往。',"The Language League lies ahead! Open the map to go there.","この先は言語大リーグ！マップから向かおう。"],
 welcome:['歡迎光臨！',"Welcome!","いらっしゃいませ！"],items:['道具',"Items","アイテム"],none:['沒有',"None","なし"],words:['單字',"words","単語"],
 innHello:['歡迎來到旅館！要休息一下嗎？',"Welcome to the inn! Would you like to rest?","旅館へようこそ！休んでいきますか？"],
 storeHello:['歡迎光臨！要買什麼？',"Welcome! What would you like?","いらっしゃいませ！何にしますか？"],
 teaHello:['要喝什麼？半糖少冰嗎？',"What'll it be? Half sugar, less ice?","何にする？甘さ半分、氷少なめ？"],
 templeHello:['拜拜以後，心情會比較平靜。',"After praying, your mind feels calmer.","お参りすると、心が落ち着く。"],
 shopDesc:['零食可以馴養動物，飲料可以恢復疲勞度。',"Snacks help you tame animals; drinks restore stamina.","おやつは動物となかよくなるのに使い、ドリンクはスタミナを回復します。"],
  gender:['角色',"Character","キャラクター"],boy:['男生',"Boy","男の子"],girl:['女生',"Girl","女の子"],guard:['道館守護人員想要對戰！',"A gym guard wants to battle!","ジムトレーナーが勝負をしかけてきた！"],
 whichPinyin:['你聽到的拼音是哪一個？',"Which pinyin did you hear?","聞こえたピンインはどれ？"],whichZhuyin:['你聽到的注音是哪一個？',"Which zhuyin did you hear?","聞こえた注音はどれ？"],
 yes:['好',"Yes","はい"],no:['不要',"No","いいえ"],cancel:['取消',"Cancel","やめる"],ok:['確定',"OK","決定"],
 comeAgain:['謝謝光臨，歡迎再來！',"Thanks, come again!","ありがとうございました。またどうぞ！"],anythingElse:['還需要什麼嗎？',"Anything else?","ほかに何かいかがですか？"],
 thanks:['謝謝！東西放進背包了。',"Thank you! It's in your bag.","ありがとうございます！バッグに入れました。"],maybeLater:['好的，沒關係。',"All right, no problem.","かしこまりました。"],
 innFull:['你看起來很有精神，不需要休息喔！',"You look full of energy; no need to rest!","元気そうだから、休まなくて大丈夫！"],
 notEnoughL:['不好意思，你的錢好像不夠。',"Sorry, you don't seem to have enough money.","すみません、お金が足りないようです。"],
 innDone:['休息好了！祝你旅途愉快。',"All rested! Have a good journey.","ゆっくり休めました！よい旅を。"],
 prayed:['拜拜完了，旅程也存檔了。',"You prayed, and your journey is saved.","お参りしました。旅の記録もセーブしました。"],
 savedLong:['旅程已經存檔了。',"Your journey has been saved.","旅の記録をセーブしました。"],
 howMany:['要買幾個？',"How many?","いくつ買いますか？"],
 nickQ:['要幫牠取小名嗎？',"Give it a nickname?","ニックネームをつけますか？"],nickBtn:['取名',"Name it","名前をつける"],noNick:['不用',"No thanks","つけない"],rename:['改名',"Rename","名前を変える"],
 petFed:['吃得好開心！',"It loved the treat!","おやつを喜んでいる！"],noTreat:['沒有寵物零食了，可以去超商買。',"Out of pet treats. Buy some at a convenience store.","ペットのおやつがない。コンビニで買えるよ。"],
 gift:['這個送你，旅途加油！',"Here, take this. Good luck on your journey!","これあげる、旅がんばってね！"],got:['得到了',"Received","手に入れた"],
 skip:['跳過',"Skip","スキップ"],lvShort:['等級',"Lv","Lv"],money:['旅費',"Money","旅費"],sign:['告示牌',"Sign","看板"]
};
const FORTUNES=[['大吉',"Great blessing! You found a snack.","大吉！おやつを見つけた。"],['中吉',"Good luck: your next battle will go well.","中吉：次のバトルはうまくいくよ。"],['小吉',"A little luck: keep practicing!","小吉：練習を続けよう！"],['吉',"Good fortune: rest well tonight.","吉：今夜はよく休もう。"]];

const UNIT={snack:'包',drink:'瓶',bubble:'杯'};
const WALKER_LINES=[
 ['這家店的東西還不錯。',"The stuff in this shop is pretty good.","この店の品物はなかなかいいよ。"],
 ['我每天都來這裡。',"I come here every day.","毎日ここに来るんだ。"],
 ['你是外國人嗎？你的中文說得很好！',"Are you from abroad? Your Chinese is great!","外国の方？中国語がとても上手だね！"],
 ['外面好熱喔，進來吹冷氣。',"It's so hot outside. I came in for the AC.","外は暑いから、涼みに来たよ。"],
 ['聽說道館館主很厲害。',"I hear the gym leader is really strong.","ジムリーダーはすごく強いらしいよ。"],
 ['我在等朋友，他又遲到了。',"I'm waiting for a friend. He's late again.","友達を待ってるんだけど、また遅刻だ。"],
 ['臺灣的超商什麼都有！',"Taiwan's convenience stores have everything!","台湾のコンビニには何でもある！"],
 ['下雨天最適合喝熱的東西。',"Rainy days are perfect for something hot to drink.","雨の日は温かい飲み物が一番だね。"]];

// ==================== data2.js ====================
// ===== 擴充題庫：每個城市再加約 15 題、多一篇閱讀 =====
const EXTRA=[
// 0 桃園
{pool:[['v','早安',"good morning","おはよう",1],['v','晚安',"good night","おやすみ",1],['v','不客氣',"you're welcome","どういたしまして",2],['v','沒關係',"it's okay","大丈夫・気にしないで",2],['v','請問',"excuse me, may I ask","すみません、お尋ねしますが",3],['v','歡迎',"welcome","ようこそ",3],
 ['g','A：謝謝！B：不＿＿。','客氣','謝謝|再見|請問',"A: Thank you! B: You're welcome.","A：ありがとう！B：どういたしまして。",2],['g','＿＿，廁所在哪裡？','請問','謝謝|再見|沒關係',"Excuse me, where is the restroom?","すみません、トイレはどこですか？",3],['g','A：對不起！B：沒＿＿。','關係','客氣|謝謝|請問',"A: Sorry! B: It's okay.","A：ごめんなさい！B：大丈夫です。",3],
 ['l','早安！今天好嗎？',"Good morning! How are you today?","おはよう！今日は元気？",1],['l','不客氣，歡迎再來。',"You're welcome. Come again.","どういたしまして、またどうぞ。",2],['l','請問，你是新同學嗎？',"Excuse me, are you a new classmate?","すみません、新しいクラスメートですか？",3],['l','晚安，明天見！',"Good night, see you tomorrow!","おやすみ、また明日！",2]],
 read2:{p:'安娜是法國人，她今天第一次來臺灣。在機場，一位小姐對她說：「歡迎來到臺灣！」安娜說：「謝謝！」小姐問：「請問你要去哪裡？」安娜說：「我要去桃園。」',qs:[['安娜是哪國人？','法國人','臺灣人|日本人'],['安娜今天第幾次來臺灣？','第一次','第二次|第三次'],['安娜要去哪裡？','桃園','臺北|法國']]}},
// 1 新竹縣
{pool:[['v','姐姐',"older sister","姉",4],['v','弟弟',"younger brother","弟",4],['v','爺爺',"grandpa","おじいさん",5],['v','奶奶',"grandma","おばあさん",5],['v','兒子',"son","息子",6],['v','女兒',"daughter","娘",6],
 ['g','這＿＿我的爸爸。','是','有|在|很',"This is my dad.","こちらは私の父です。",4],['g','我沒＿＿弟弟。','有','是|很|在',"I don't have a younger brother.","私には弟がいません。",5],['g','你爸爸＿＿什麼工作？','做','是|有|去',"What work does your dad do?","お父さんは何の仕事をしていますか？",6],
 ['l','我爺爺今年八十歲了。',"My grandpa is 80 this year.","祖父は今年80歳です。",5],['l','我姐姐是醫生，我弟弟是學生。',"My older sister is a doctor; my younger brother is a student.","姉は医者で、弟は学生です。",6],['l','你有兄弟姐妹嗎？',"Do you have any siblings?","兄弟はいますか？",5],['l','這是我女兒，她五歲。',"This is my daughter; she's five.","これは娘で、5歳です。",6]],
 read2:{p:'小明家有爺爺、奶奶、爸爸、媽媽、一個姐姐跟他。爺爺跟奶奶住在新竹縣，週末他們全家都回去看爺爺奶奶。奶奶很會做客家菜，小明最喜歡吃奶奶做的菜。',qs:[['小明家有幾個人？','六個人','五個人|七個人'],['爺爺奶奶住在哪裡？','新竹縣','臺北|小明家'],['小明最喜歡什麼？','奶奶做的菜','姐姐做的菜|新竹的風']]}},
// 2 新竹市
{pool:[['v','中午',"noon","昼",7],['v','下午',"afternoon","午後",7],['v','小時',"hour","時間",8],['v','分鐘',"minute (duration)","分間",8],['v','時鐘',"clock","時計",9],['v','幾點',"what time","何時",9],
 ['g','我每天睡八個＿＿。','小時','點|分|半',"I sleep eight hours every day.","毎日8時間寝ます。",8],['g','現在＿＿點？','幾','什麼|哪|多',"What time is it now?","今何時ですか？",7],['g','電影七點＿＿開始。','半','點|分鐘|小時',"The movie starts at 7:30.","映画は7時半に始まります。",9],
 ['l','我中午十二點吃午飯。',"I eat lunch at noon.","お昼の12時に昼ご飯を食べます。",7],['l','從這裡走路要十分鐘。',"It's a ten-minute walk from here.","ここから歩いて10分です。",8],['l','我們下午兩點半見面吧。',"Let's meet at 2:30 p.m.","午後2時半に会いましょう。",9],['l','現在已經十一點了，快去睡覺！',"It's already 11. Go to bed!","もう11時だよ、早く寝なさい！",10]],
 read2:{p:'新竹有很多科技公司。阿風在公司工作，他每天早上九點上班，晚上六點下班，中午有一個小時可以吃飯跟休息。星期五晚上，他常常跟同事去吃米粉。',qs:[['阿風幾點上班？','早上九點','晚上六點|中午'],['中午阿風有多久可以休息？','一個小時','十分鐘|半個小時'],['星期五晚上阿風常常做什麼？','跟同事去吃米粉','在公司加班|回家睡覺']]}},
// 3 苗栗
{pool:[['v','月',"month","月",10],['v','號',"date (day of month)","日",10],['v','去年',"last year","去年",11],['v','明年',"next year","来年",11],['v','愛',"to love","愛する",12],['v','興趣',"hobby","趣味",13],
 ['g','你的生日是幾月幾＿＿？','號','點|年|個',"What's the date of your birthday?","誕生日は何月何日ですか？",11],['g','我＿＿看書，也喜歡聽音樂。','喜歡','生日|週末|今天',"I like reading, and I also like music.","本を読むのが好きで、音楽を聴くのも好きです。",12],['g','你的＿＿是什麼？','興趣','喜歡|星期|週末',"What's your hobby?","趣味は何ですか？",13],
 ['l','今天是三月十五號，星期二。',"Today is Tuesday, March 15.","今日は3月15日、火曜日です。",10],['l','我的興趣是唱歌跟爬山。',"My hobbies are singing and hiking.","趣味は歌と山登りです。",12],['l','去年我來過苗栗一次。',"I came to Miaoli once last year.","去年一度苗栗に来ました。",12],['l','我不喜歡下雨天。',"I don't like rainy days.","雨の日は好きじゃありません。",11]],
 read2:{p:'小美的興趣是做蛋糕。她最喜歡用苗栗的草莓做草莓蛋糕。下個星期六是她媽媽的生日，她打算做一個大蛋糕送給媽媽。',qs:[['小美的興趣是什麼？','做蛋糕','摘草莓|唱歌'],['下個星期六是誰的生日？','小美的媽媽','小美|小美的朋友'],['小美打算做什麼？','做一個大蛋糕送媽媽','買草莓|去苗栗玩']]}},
// 4 臺中
{pool:[['v','早餐',"breakfast","朝ご飯",13],['v','午餐',"lunch","昼ご飯",13],['v','晚餐',"dinner","晩ご飯",14],['v','辣',"spicy","辛い",14],['v','甜',"sweet","甘い",15],['v','點菜',"to order food","料理を注文する",16],
 ['g','你要喝＿＿還是咖啡？','茶','吃|好|杯',"Would you like tea or coffee?","お茶とコーヒー、どちらにしますか？",13],['g','這道菜有一點＿＿，你可以吃嗎？','辣','點菜|晚餐|杯',"This dish is a little spicy. Can you eat it?","この料理は少し辛いですが、食べられますか？",15],['g','我想＿＿，請給我菜單。','點菜','外帶|好吃|早餐',"I'd like to order; please give me the menu.","注文したいので、メニューをください。",16],
 ['l','你吃過早餐了嗎？',"Have you had breakfast?","朝ご飯はもう食べましたか？",13],['l','這杯奶茶太甜了。',"This milk tea is too sweet.","このミルクティーは甘すぎる。",14],['l','我不太能吃辣。',"I can't handle spicy food very well.","辛いものはあまり食べられません。",15],['l','老闆，買單！',"Excuse me, the check please!","すみません、お会計お願いします！",16]],
 read2:{p:'臺中的夜市很熱鬧，晚上七點以後人最多。大家喜歡吃雞排、喝珍珠奶茶。小林第一次去夜市，他點了一個很辣的雞排，雖然有一點辣，可是他覺得很好吃。',qs:[['夜市什麼時候人最多？','晚上七點以後','早上|中午'],['小林點了什麼？','很辣的雞排','珍珠奶茶|太陽餅'],['小林覺得雞排怎麼樣？','有一點辣，可是很好吃','不好吃|太甜了']]}},
// 5 彰化
{pool:[['v','衣服',"clothes","服",16],['v','鞋子',"shoes","靴",16],['v','試穿',"to try on","試着する",17],['v','大小',"size","サイズ",18],['v','顏色',"color","色",18],['v','打折',"to discount","割引する",19],
 ['g','這件衣服可以＿＿嗎？','試穿','打折|顏色|大小',"Can I try on this piece of clothing?","この服、試着してもいいですか？",17],['g','這雙鞋子太＿＿了，有小一點的嗎？','大','少|早|快',"These shoes are too big. Do you have smaller ones?","この靴は大きすぎます。もう少し小さいのはありますか？",18],['g','今天全部＿＿，買二送一。','打折','試穿|顏色|衣服',"Everything is on sale today: buy two, get one free.","今日は全品セール、2つ買うと1つおまけ。",19],
 ['l','你喜歡什麼顏色？',"What color do you like?","何色が好きですか？",17],['l','這雙鞋子打八折。',"These shoes are 20% off.","この靴は2割引です。",19],['l','有沒有大一點的？',"Do you have a bigger one?","もう少し大きいのはありますか？",18],['l','一共三百二十塊。',"That's NT$320 in total.","全部で320元です。",17]],
 read2:{p:'阿嬌的女兒在彰化市場賣衣服。今天她的店打八折，一件衣服原來五百塊，打折以後只要四百塊。很多阿姨來買，有的人還試穿了很多次。',qs:[['阿嬌的女兒在哪裡賣衣服？','彰化市場','臺中夜市|機場'],['打折以後一件衣服多少錢？','四百塊','五百塊|八百塊'],['今天的衣服打幾折？','八折','五折|九折']]}},
// 6 南投
{pool:[['v','晴天',"sunny day","晴れ",19],['v','陰天',"cloudy day","曇り",20],['v','涼快',"pleasantly cool","涼しい",20],['v','霧',"fog","霧",21],['v','溫度',"temperature","気温",21],['v','爬山',"to hike up a mountain","山に登る",22],
 ['g','今天是晴天，＿＿很舒服。','天氣','下雨|陰天|霧',"It's sunny today; the weather is lovely.","今日は晴れで、天気が気持ちいい。",20],['g','山上的溫度比山下＿＿。','低','快|多|貴',"It's colder up the mountain than at the bottom.","山の上は麓より気温が低い。",21],['g','早上有＿＿，開車要小心。','霧','晴天|溫度|涼快',"There's fog in the morning; drive carefully.","朝は霧が出るので、運転に気をつけて。",22],
 ['l','明天是陰天，可能會下雨。',"Tomorrow will be cloudy; it might rain.","明日は曇りで、雨が降るかもしれません。",20],['l','日月潭早上常常有霧。',"There's often fog at Sun Moon Lake in the morning.","日月潭は朝よく霧が出ます。",21],['l','現在溫度是二十度，很涼快。',"It's 20 degrees now, nice and cool.","今の気温は20度で、とても涼しい。",21],['l','天氣好的時候，我們去爬山。',"When the weather is good, we go hiking.","天気がいい時は、山登りに行きます。",22]],
 read2:{p:'南投的清境農場在山上，夏天也很涼快，溫度常常只有二十度左右。早上有時候有霧，看起來很漂亮。那裡有很多羊，很多遊客喜歡去看羊。',qs:[['清境農場夏天的天氣怎麼樣？','很涼快','很熱|常常下雨'],['早上有時候會有什麼？','霧','颱風|雪'],['很多遊客喜歡去看什麼？','羊','海|熱氣球']]}},
// 7 雲林
{pool:[['v','飛機',"airplane","飛行機",22],['v','計程車',"taxi","タクシー",23],['v','腳踏車',"bicycle","自転車",23],['v','塞車',"traffic jam","渋滞",24],['v','停車',"to park","駐車する",24],['v','換車',"to transfer","乗り換える",25],
 ['g','我坐＿＿去機場。','計程車','停車|塞車|換車',"I take a taxi to the airport.","タクシーで空港へ行きます。",23],['g','路上＿＿了，我會晚一點到。','塞車','停車|換車|開車',"There's a traffic jam; I'll be a bit late.","渋滞しているので、少し遅れます。",24],['g','你要在臺中＿＿高鐵。','換','開|塞|停',"You need to change to the HSR in Taichung.","台中で高速鉄道に乗り換えてください。",25],
 ['l','這裡不能停車。',"You can't park here.","ここは駐車禁止です。",24],['l','我每天騎腳踏車上學。',"I ride a bike to school every day.","毎日自転車で通学しています。",23],['l','坐飛機比坐船快多了。',"Flying is much faster than taking a boat.","飛行機は船よりずっと速い。",25],['l','下班的時候常常塞車。',"There's often traffic at rush hour.","帰宅時間はよく渋滞します。",24]],
 read2:{p:'雲林沒有捷運，所以很多人騎機車或開車。阿土的孫子在臺北念書，他回雲林的時候，先坐高鐵到雲林站，再換公車回家。週末高速公路常常塞車，所以他不喜歡坐客運。',qs:[['雲林有捷運嗎？','沒有','有|很多'],['孫子坐高鐵以後要做什麼？','換公車回家','坐飛機|騎腳踏車'],['他為什麼不喜歡坐客運？','週末常常塞車','客運太貴|沒有座位']]}},
// 8 嘉義縣
{pool:[['v','前面',"in front","前",25],['v','後面',"behind","後ろ",25],['v','樓上',"upstairs","上の階",26],['v','樓下',"downstairs","下の階",26],['v','中間',"middle, between","真ん中",27],['v','地圖',"map","地図",27],
 ['g','廁所在樓＿＿，請上樓。','上','下|前|後',"The restroom is upstairs; please go up.","トイレは上の階です、上がってください。",26],['g','銀行在郵局跟學校＿＿。','中間','前面|後面|樓上',"The bank is between the post office and the school.","銀行は郵便局と学校の間にあります。",27],['g','你可以在＿＿上找到這個地方。','地圖','樓下|中間|前面',"You can find this place on the map.","地図でこの場所を見つけられます。",28],
 ['l','餐廳在樓下，咖啡店在樓上。',"The restaurant is downstairs; the café is upstairs.","レストランは下の階、カフェは上の階です。",26],['l','車站在銀行後面。',"The station is behind the bank.","駅は銀行の裏にあります。",25],['l','請看地圖，我們現在在這裡。',"Look at the map: we're here now.","地図を見て、今ここにいます。",27],['l','過了橋就左轉。',"Turn left right after the bridge.","橋を渡ったら左に曲がってください。",28]],
 read2:{p:'阿里山車站前面有一條小路，一直走大概十分鐘，就可以看到一棵很大的神木。神木後面有一個小廟，廟的旁邊有一間賣茶的小店。',qs:[['從車站走到神木要多久？','大概十分鐘','一個小時|兩分鐘'],['神木後面有什麼？','一個小廟','一個車站|一條河'],['小店賣什麼？','茶','咖啡|衣服']]}},
// 9 嘉義市
{pool:[['v','洗澡',"to take a shower","お風呂に入る",28],['v','刷牙',"to brush one's teeth","歯を磨く",28],['v','出門',"to go out","出かける",29],['v','回家',"to go home","帰宅する",29],['v','午覺',"afternoon nap","昼寝",30],['v','才',"not until; only then","やっと",31],
 ['g','我先刷牙，＿＿洗臉。','再','才|已經|還沒',"I brush my teeth first, then wash my face.","先に歯を磨いて、それから顔を洗います。",29],['g','他昨天晚上十二點＿＿回家。','才','就|再|也',"He didn't get home until midnight last night.","彼は昨夜12時になってやっと帰宅した。",31],['g','你今天幾點＿＿？','出門','午覺|才|再',"What time are you going out today?","今日は何時に出かけますか？",29],
 ['l','我每天晚上十點洗澡。',"I shower at 10 every night.","毎晩10時にお風呂に入ります。",28],['l','吃完飯以後要刷牙。',"Brush your teeth after eating.","食後は歯を磨きましょう。",28],['l','我累了，想睡個午覺。',"I'm tired; I want to take a nap.","疲れたから昼寝したい。",30],['l','他八點就出門了。',"He already left at eight.","彼は8時にはもう出かけた。",31]],
 read2:{p:'嘉義市的文化路晚上很熱鬧。阿娟下班回家以後，先洗澡，然後跟家人一起去文化路散步。他們常常吃了雞肉飯才回家，回家的時候已經十點了。',qs:[['文化路什麼時候很熱鬧？','晚上','早上|中午'],['阿娟回家以後先做什麼？','洗澡','吃雞肉飯|散步'],['他們幾點回到家？','十點','八點|十二點']]}},
// 10 臺南
{pool:[['v','參觀',"to visit (a site)","見学する",31],['v','廟',"temple","廟",32],['v','從來',"ever (with 沒: never)","これまで",32],['v','有趣',"interesting","面白い",33],['v','拍照',"to take photos","写真を撮る",33],['v','紀念品',"souvenir","お土産",34],
 ['g','我從來沒＿＿過豆花。','吃','了|在|著',"I've never eaten douhua.","豆花を食べたことが一度もありません。",32],['g','我們去赤崁樓＿＿吧。','參觀','紀念品|有趣|從來',"Let's go visit Chihkan Tower.","赤崁楼を見学しに行こう。",33],['g','這裡可以＿＿嗎？','拍照','紀念品|從來|有趣',"Can I take photos here?","ここで写真を撮ってもいいですか？",33],
 ['l','你參觀過安平古堡嗎？',"Have you visited Anping Fort?","安平古堡を見学したことがありますか？",33],['l','臺南的廟很多，也很漂亮。',"Tainan has many temples, and they're beautiful.","台南は廟が多くて、とてもきれいです。",31],['l','這個紀念品很有趣。',"This souvenir is interesting.","このお土産は面白い。",33],['l','我從來沒吃過這麼好吃的牛肉湯。',"I've never had beef soup this good.","こんなにおいしい牛肉スープは初めてです。",34]],
 read2:{p:'林太太第一次去臺南，她參觀了安平古堡跟很多有名的廟，也拍了很多照片。她說臺南的小吃又便宜又好吃，她從來沒吃過那麼好吃的蝦捲。',qs:[['林太太去臺南做了什麼？','參觀古蹟跟拍照','買房子|找工作'],['林太太覺得臺南的小吃怎麼樣？','又便宜又好吃','很貴|不好吃'],['林太太從來沒吃過什麼？','那麼好吃的蝦捲','牛肉湯|豆花']]}},
// 11 高雄
{pool:[['v','一樣',"the same","同じ",34],['v','不同',"different","違う",34],['v','更',"even more","さらに",35],['v','最',"most","最も",35],['v','差不多',"about the same","だいたい同じ",36],['v','選擇',"to choose","選ぶ",37],
 ['g','我的手機跟你的＿＿。','一樣','比|更|最',"My phone is the same as yours.","私の携帯はあなたのと同じです。",35],['g','高雄的冬天比臺北＿＿暖和。','更','最|一樣|不同',"Kaohsiung's winter is even warmer than Taipei's.","高雄の冬は台北よりさらに暖かい。",36],['g','這兩家店的價錢＿＿。','差不多','更|最|比',"These two shops' prices are about the same.","この2軒の値段はだいたい同じです。",37],
 ['l','高雄的天氣比臺北熱一點。',"Kaohsiung is a little hotter than Taipei.","高雄は台北より少し暑い。",34],['l','這兩件衣服的顏色不同。',"These two pieces of clothing are different colors.","この2着は色が違います。",35],['l','你最喜歡哪一個？',"Which one do you like most?","どれが一番好きですか？",35],['l','我選這個，因為它比較便宜。',"I'll choose this one because it's cheaper.","安いからこれにします。",37]],
 read2:{p:'高雄的駁二藝術特區以前是港口的倉庫，現在變成了藝術中心。跟以前比起來，這裡更熱鬧，也更有活力。週末有很多年輕人來拍照，比平常多了兩倍。',qs:[['駁二以前是什麼？','港口的倉庫','學校|夜市'],['跟以前比，現在的駁二怎麼樣？','更熱鬧','更安靜|一樣'],['週末有誰常常來拍照？','很多年輕人','很多老人|很多漁夫']]}},
// 12 澎湖
{pool:[['v','準備',"to prepare","準備する",37],['v','安排',"to arrange","手配する",38],['v','旅館',"hotel","ホテル",38],['v','預約',"to reserve","予約する",39],['v','行程',"itinerary","旅程",39],['v','出發',"to depart","出発する",40],
 ['g','我們明天早上七點＿＿。','出發','行程|旅館|預約',"We depart at 7 tomorrow morning.","明日の朝7時に出発します。",38],['g','你＿＿好行李了嗎？','準備','出發|行程|預約',"Have you got your luggage ready?","荷物の準備はできましたか？",39],['g','這次的＿＿是三天兩夜。','行程','旅館|出發|準備',"This trip is three days, two nights.","今回の旅程は2泊3日です。",40],
 ['l','我已經預約了旅館。',"I've already booked a hotel.","もうホテルを予約しました。",38],['l','明天的行程是去看石滬。',"Tomorrow's plan is to see the stone weirs.","明日の予定は石垣の見学です。",39],['l','船八點出發，不要遲到。',"The boat leaves at eight. Don't be late.","船は8時に出発するから、遅れないで。",39],['l','你打算在澎湖住幾天？',"How many days do you plan to stay in Penghu?","澎湖に何日泊まる予定ですか？",40]],
 read2:{p:'小王打算暑假去澎湖玩四天。他先上網預約了民宿，再安排每天的行程：第一天看石滬，第二天坐船去小島，第三天騎機車環島，最後一天買紀念品。',qs:[['小王打算在澎湖玩幾天？','四天','三天|一個星期'],['第二天要做什麼？','坐船去小島','看石滬|買紀念品'],['小王先做了什麼？','預約民宿','買機票|騎機車']]}},
// 13 屏東
{pool:[['v','看書',"to read","本を読む",40],['v','打電話',"to make a phone call","電話をかける",41],['v','做飯',"to cook","ご飯を作る",41],['v','開會',"to have a meeting","会議をする",42],['v','跳舞',"to dance","踊る",42],['v','曬太陽',"to sunbathe","日光浴をする",43],
 ['g','媽媽在＿＿，等一下再打電話給她。','做飯','跳舞了|看過|開會過',"Mom is cooking; call her later.","母は料理中だから、後で電話して。",41],['g','A：你在做什麼？B：我在＿＿。','看書','書看|看了|看過',"A: What are you doing? B: I'm reading.","A：何してるの？B：本を読んでるよ。",40],['g','他們正在開會，請＿＿說話。','小聲','大聲|開會|跳舞',"They're in a meeting; please speak quietly.","会議中なので、小声で話してください。",42],
 ['l','我正在打電話，等一下回你。',"I'm on the phone; I'll get back to you.","今電話中だから、後で返事するね。",41],['l','孩子們正在海邊跳舞。',"The kids are dancing on the beach.","子どもたちは海辺で踊っています。",42],['l','他在房間裡看書。',"He's reading in his room.","彼は部屋で本を読んでいます。",40],['l','你們在做什麼？我們在曬太陽。',"What are you doing? We're sunbathing.","何してるの？日光浴してるよ。",43]],
 read2:{p:'星期天下午，墾丁的海邊人很多。有人正在游泳，有人在衝浪，有一群大學生在沙灘上打排球。小琪站在燈塔旁邊，一邊吃冰淇淋，一邊看海。',qs:[['大學生在沙灘上做什麼？','打排球','游泳|跳舞'],['小琪站在哪裡？','燈塔旁邊','海裡|房間裡'],['小琪一邊看海，一邊做什麼？','吃冰淇淋','打電話|看書']]}},
// 14 臺東
{pool:[['v','頭痛',"headache","頭痛",43],['v','發燒',"to have a fever","熱が出る",44],['v','肚子',"belly","お腹",44],['v','開心',"happy","嬉しい",45],['v','難過',"sad","悲しい",45],['v','害怕',"afraid","怖い",46],
 ['g','我肚子很＿＿，想吃東西。','餓','飽|難過|害怕',"I'm hungry and want to eat.","お腹が空いたので、何か食べたい。",44],['g','小狗不見了，她很＿＿。','難過','開心|飽|發燒',"Her puppy is missing; she's very sad.","子犬がいなくなって、彼女はとても悲しい。",45],['g','我有一點＿＿高的地方。','怕','頭痛|發燒|肚子',"I'm a bit afraid of high places.","高いところが少し怖いです。",46],
 ['l','我發燒了，今天不能去上課。',"I have a fever, so I can't go to class today.","熱が出たので、今日は授業に行けません。",44],['l','聽到這個消息，大家都很開心。',"Everyone was happy to hear the news.","その知らせを聞いて、みんな喜んだ。",45],['l','你看起來很累，要不要休息？',"You look tired. Want to rest?","疲れているみたいだね、休む？",43],['l','別害怕，熱氣球很安全。',"Don't be afraid; the balloon is very safe.","怖がらないで、熱気球はとても安全だよ。",46]],
 read2:{p:'小晴的弟弟第一次坐熱氣球，上去以前他很害怕，說他頭痛、肚子痛。可是熱氣球飛起來以後，他看到很美的風景，就不害怕了，還一直說好開心。',qs:[['弟弟坐熱氣球以前覺得怎麼樣？','很害怕','很開心|很累'],['弟弟說他哪裡不舒服？','頭痛、肚子痛','發燒|腳痛'],['熱氣球飛起來以後，弟弟怎麼樣了？','不害怕了，很開心','還是很害怕|睡著了']]}},
// 15 花蓮
{pool:[['v','而且',"moreover","しかも",46],['v','甚至',"even (go so far as)","さらには",47],['v','遊客',"tourist","観光客",47],['v','步道',"walking trail","遊歩道",48],['v','大理石',"marble","大理石",48],['v','部落',"Indigenous village","部落",49],
 ['g','花蓮不但有山，＿＿有海。','而且','雖然|因為|連',"Hualien has not only mountains but also the sea.","花蓮には山だけでなく海もある。",47],['g','這條步道很難走，＿＿年輕人都覺得累。','連','不但|而且|就',"This trail is so hard that even young people get tired.","この遊歩道はきつくて、若者でさえ疲れる。",48],['g','他每天練習，＿＿週末也不休息。','甚至','因為|不但|雖然',"He practices every day, even on weekends.","彼は毎日練習していて、週末さえ休まない。",49],
 ['l','太魯閣的大理石很有名。',"Taroko's marble is famous.","タロコの大理石は有名です。",47],['l','這條步道不但好走，而且風景很美。',"This trail is easy, and the scenery is beautiful too.","この遊歩道は歩きやすいだけでなく、景色も美しい。",48],['l','連下雨天都有很多遊客。',"Even on rainy days there are lots of tourists.","雨の日でさえ観光客がたくさんいる。",48],['l','我們去部落學做小米酒。',"We went to the village to learn to make millet wine.","部落で粟の酒造りを習った。",49]],
 read2:{p:'花蓮的七星潭有很多石頭，海水很藍。來這裡的遊客不但可以看海、聽海浪的聲音，而且晚上還可以看星星。有的人很喜歡這裡，甚至每年都來。',qs:[['七星潭有很多什麼？','石頭','沙子|樹'],['晚上在七星潭可以做什麼？','看星星','游泳|看熱氣球'],['有的人喜歡七星潭到什麼程度？','每年都來','來過一次|從來沒來過']]}},
// 16 宜蘭
{pool:[['v','拿',"to take, pick up","取る",49],['v','送',"to deliver; to give","届ける・贈る",50],['v','打掃',"to clean","掃除する",50],['v','整理',"to tidy up","整理する",51],['v','垃圾',"trash","ゴミ",51],['v','冰箱',"refrigerator","冷蔵庫",52],
 ['g','請你把垃圾拿＿＿。','出去','過|著|了',"Please take the trash out.","ゴミを出してください。",50],['g','我把房間＿＿乾淨了。','打掃','拿|送|吃',"I've cleaned the room.","部屋をきれいに掃除しました。",51],['g','他把牛奶放進＿＿裡了。','冰箱','垃圾|打掃|整理',"He put the milk in the fridge.","彼は牛乳を冷蔵庫に入れた。",52],
 ['l','請把窗戶打開。',"Please open the window.","窓を開けてください。",49],['l','我已經把書整理好了。',"I've already sorted out the books.","本はもう整理しました。",51],['l','你把我的手機放在哪裡了？',"Where did you put my phone?","私の携帯、どこに置いたの？",50],['l','把垃圾分類以後再丟。',"Sort the trash before you throw it out.","ゴミは分別してから捨ててね。",52]],
 read2:{p:'過年以前，阿德全家一起打掃房子。爸爸把窗戶洗乾淨，媽媽把冰箱整理好，阿德把垃圾拿出去，還把春聯貼在門上。打掃完以後，大家一起去礁溪泡溫泉。',qs:[['阿德全家什麼時候打掃房子？','過年以前','週末|放假以後'],['阿德把什麼貼在門上？','春聯','照片|地圖'],['打掃完以後大家做什麼？','去泡溫泉','去拔蔥|去看海']]}},
// 17 基隆
{pool:[['v','弄壞',"to break (something)","壊す",52],['v','撿',"to pick up","拾う",53],['v','罵',"to scold","叱る",53],['v','叫醒',"to wake (someone) up","起こす",54],['v','拿走',"to take away","持っていく",54],['v','發現',"to discover","見つける",55],
 ['g','我的手機被弟弟＿＿了。','弄壞','喝|跑|睡',"My phone was broken by my younger brother.","携帯を弟に壊された。",53],['g','我早上被鬧鐘＿＿了。','叫醒','弄壞|罵|撿',"The alarm clock woke me up this morning.","朝、目覚まし時計に起こされた。",54],['g','他上課睡覺，＿＿老師罵了。','被','把|比|跟',"He slept in class and got scolded by the teacher.","彼は授業中に寝て、先生に叱られた。",54],
 ['l','我的雨傘被別人拿走了。',"Someone took my umbrella.","傘を誰かに持っていかれた。",53],['l','小偷被警察抓到了。',"The thief was caught by the police.","泥棒は警察に捕まった。",54],['l','他的祕密被大家發現了。',"Everyone found out his secret.","彼の秘密がみんなにばれた。",55],['l','我被雨淋濕了，好冷！',"I got soaked by the rain. So cold!","雨でびしょ濡れ、寒い！",52]],
 read2:{p:'小雨的貓很調皮。昨天她的杯子被貓弄壞了，桌上的魚也被貓吃光了。小雨本來很生氣，可是看到貓睡覺的樣子，她又笑了。',qs:[['小雨的杯子怎麼了？','被貓弄壞了','被偷了|被風吹走了'],['桌上的魚怎麼了？','被貓吃光了','被小雨吃了|掉在地上'],['看到貓睡覺的樣子，小雨怎麼樣？','笑了','更生氣了|哭了']]}},
// 18 新北
{pool:[['v','要是',"if (colloquial)","もし",55],['v','只要',"as long as","～さえすれば",56],['v','還是',"still, nevertheless","やはり",56],['v','老街',"old street","老街（古い町並み）",57],['v','天燈',"sky lantern","天灯",57],['v','願望',"wish","願い",58],
 ['g','＿＿你有時間，就來平溪放天燈吧。','要是','雖然|可是|還是',"If you have time, come to Pingxi to release sky lanterns.","時間があれば、平渓に天灯を上げに来て。",56],['g','雖然下雨，他們＿＿去了老街。','還是','要是|只要|如果',"Although it rained, they still went to the old street.","雨だったけれど、彼らはやはり老街に行った。",57],['g','＿＿多練習，你的中文就會越來越好。','只要','雖然|可是|還是',"As long as you practice, your Chinese will keep improving.","たくさん練習さえすれば、中国語はどんどん上手になる。",58],
 ['l','要是明天下雨，我們就不去了。',"If it rains tomorrow, we won't go.","もし明日雨なら、行かないことにしよう。",55],['l','在天燈上寫下你的願望吧。',"Write your wish on the sky lantern.","天灯に願い事を書こう。",57],['l','九份老街雖然很擠，但是很好玩。',"Jiufen Old Street is crowded but fun.","九份老街は混んでいるけど、とても楽しい。",56],['l','只要坐一個小時的車就到了。',"It's just an hour's ride away.","車で1時間乗れば着きます。",58]],
 read2:{p:'新北的平溪每年都有天燈節。很多人在天燈上寫下自己的願望，然後把天燈放到天上。雖然那天人很多，交通不太方便，但是大家還是很開心。要是你有機會，一定要去看看。',qs:[['大家在天燈上寫什麼？','自己的願望','自己的名字|地圖'],['天燈節那天交通怎麼樣？','不太方便','很方便|沒有人'],['作者建議什麼？','有機會一定要去看看','不要去平溪|只能看照片']]}},
// 19 臺北
{pool:[['v','公司',"company","会社",58],['v','同事',"coworker","同僚",58],['v','生活',"life, daily living","生活",59],['v','薪水',"salary","給料",59],['v','房租',"rent","家賃",60],['v','壓力',"stress, pressure","ストレス",60],
 ['g','臺北的房租＿＿來越貴。','越','更|最|比',"Rent in Taipei keeps getting more expensive.","台北の家賃はどんどん高くなっている。",59],['g','最近工作很忙，＿＿很大。','壓力','薪水|房租|同事',"Work has been busy lately; the stress is high.","最近仕事が忙しくて、ストレスが大きい。",60],['g','我跟＿＿一起去吃午飯。','同事','公司|薪水|生活',"I go to lunch with my coworkers.","同僚と一緒に昼ご飯を食べに行きます。",59],
 ['l','在臺北生活很方便，可是房租很貴。',"Life in Taipei is convenient, but rent is expensive.","台北の生活は便利だけど、家賃が高い。",59],['l','我們公司在一零一大樓附近。',"Our company is near Taipei 101.","うちの会社は101ビルの近くにあります。",58],['l','下班以後，我常常去運動減壓。',"After work, I often exercise to de-stress.","仕事の後、よく運動でストレス発散します。",61],['l','他換了工作，薪水比以前高。',"He changed jobs, and his salary is higher now.","彼は転職して、給料が前より高くなった。",60]],
 read2:{p:'小安說，在臺北生活有好有壞。好的地方是交通方便，捷運跟公車都很多；壞的地方是房租越來越貴，工作壓力也很大。所以週末他喜歡去陽明山走走，放鬆一下。',qs:[['在臺北生活好的地方是什麼？','交通方便','房租便宜|工作輕鬆'],['壞的地方是什麼？','房租貴、壓力大','沒有捷運|天氣太冷'],['週末小安喜歡做什麼？','去陽明山走走','在公司加班|去夜市']]}},
// 20 金門
{pool:[['v','由於',"due to","～のため",61],['v','因此',"therefore","そのため",62],['v','影響',"influence","影響",62],['v','保存',"to preserve","保存する",63],['v','居民',"resident","住民",63],['v','特產',"local specialty","特産品",64],
 ['g','＿＿風很大，金門人在村子裡放風獅爺。','由於','因此|影響|保存',"Due to strong winds, Kinmen people placed Wind Lion Gods in villages.","風が強いため、金門の人々は村に風獅爺を置いた。",62],['g','這裡的老房子保存得很好，＿＿吸引了很多遊客。','因此','由於|雖然|只要',"The old houses are well preserved, so they attract many tourists.","古い家がよく保存されていて、そのため多くの観光客を引きつけている。",63],['g','戰爭對金門的＿＿很大。','影響','特產|居民|保存',"The war had a great influence on Kinmen.","戦争は金門に大きな影響を与えた。",64],
 ['l','高粱酒是金門的特產。',"Sorghum liquor is a Kinmen specialty.","コーリャン酒は金門の特産品です。",62],['l','由於天氣不好，飛機延誤了。',"Due to bad weather, the flight was delayed.","天気が悪いため、飛行機が遅れた。",63],['l','這些建築都保存得很好。',"These buildings are all well preserved.","これらの建物はどれもよく保存されている。",63],['l','當地居民都很熱情。',"The local residents are very warm.","地元の人はみんなとても親切です。",64]],
 read2:{p:'金門的居民以前常常受到戰爭的影響，因此很多人到外地工作。現在金門很和平，政府把很多老房子保存下來，變成民宿跟博物館，吸引了很多遊客。',qs:[['以前很多金門人為什麼去外地工作？','受到戰爭的影響','因為天氣太熱|因為想學英文'],['老房子現在變成了什麼？','民宿跟博物館','學校跟醫院|夜市'],['現在的金門怎麼樣？','很和平','還有戰爭|沒有遊客']]}},
// 21 連江
{pool:[['v','即使',"even if","たとえ～でも",64],['v','寧可',"would rather","むしろ",65],['v','何況',"let alone","まして",66],['v','難得',"rare","めったにない",66],['v','珍惜',"to cherish","大切にする",67],['v','景象',"scene, sight","光景",67],
 ['g','＿＿下雨，我們也要去看藍眼淚。','即使','既然|與其|何況',"Even if it rains, we'll still go see the Blue Tears.","たとえ雨でも、青い涙を見に行く。",65],['g','我＿＿走路，也不想等那麼久的公車。','寧可','即使|何況|難得',"I'd rather walk than wait that long for the bus.","あんなに長くバスを待つくらいなら、むしろ歩きたい。",66],['g','連大人都覺得累，＿＿是小孩子呢？','何況','即使|寧可|既然',"Even adults find it tiring, let alone children.","大人でさえ疲れるのに、まして子どもならなおさらだ。",67],
 ['l','這麼美的景象很難得。',"Such a beautiful sight is rare.","こんなに美しい光景はめったにない。",66],['l','既然來了，就好好珍惜這次機會。',"Since you're here, make the most of this chance.","せっかく来たのだから、この機会を大切にしよう。",67],['l','即使很冷，也有很多人在等。',"Even though it's cold, many people are waiting.","寒くても、たくさんの人が待っている。",65],['l','與其抱怨，不如想辦法。',"Rather than complain, find a solution.","文句を言うより、方法を考えたほうがいい。",66]],
 read2:{p:'馬祖的冬天很冷，風也很大，即使是當地人也很少出門。可是夏天的晚上，海邊會出現藍眼淚，這種景象非常難得。小藍說，與其在家看電視，不如出去看看大自然，好好珍惜美麗的家鄉。',qs:[['馬祖的冬天怎麼樣？','很冷，風也很大','很熱|常常有藍眼淚'],['什麼時候可以看到藍眼淚？','夏天的晚上','冬天的早上|每天中午'],['小藍建議大家做什麼？','出去看看大自然','在家看電視|搬到臺北']]}}
];
EXTRA.forEach((e,i)=>{CITIES[i].pool.push(...e.pool);CITIES[i].read2=e.read2});

// ==================== pinyin.js ====================
// 臺灣讀音（教育部標準）：星期 xīngqí、夕陽 xìyáng、危險 wéixiǎn、誰 shéi。
const PY_RAW=`a1 阿|ai4 愛|an1 安|ba1 八吧巴|ba3 把|ba5 吧|bai2 白|bai3 百|ban4 半辦|bang1 幫|bao1 包|bao3 保|bei4 被|ben3 本|bi3 比筆|bian1 邊|bian4 便|bie2 別|bing4 病|bu4 不|bu3 補|cai4 菜|cai2 才|chang2 常長|chang4 唱|che1 車|chi1 吃|chu1 出|chu2 除|chuan1 穿|chuang1 窗|chuang2 床|ci4 次|cong2 從|da3 打|da4 大|dai4 帶|dan1 單|dan4 但蛋|dang1 當|dao1 刀|dao3 導島|dao4 到道稻|de5 的得|de2 得|deng3 等|di4 地第弟|dian3 點|dian4 店電|ding4 定訂|dong1 東冬|dong4 動|dou1 都|dou4 豆|du4 度|duo1 多|e2 鵝|er2 而兒|er4 二|fa3 法|fan4 飯|fang1 方|fang4 放|fei1 飛|fei1 非|feng1 風|fu4 附|gai1 該|gan3 感|gang1 剛|gang3 港|gao1 高|gao4 告|ge1 哥|ge4 個|gei3 給|gen1 跟|gong1 公功|gu3 古|gu4 故|guan1 關觀|guan3 館|gui3 軌|gui4 貴|guo2 國|guo4 過|hai2 還孩|hai3 海|han4 漢|hao3 好|hao4 號|he1 喝|he2 合|hen3 很|hou4 後候|hu1 呼|hua1 花|hua4 話畫|huan1 歡|hui2 回|hui4 會|huo3 火|ji1 機雞|ji2 即急級|ji3 幾|ji4 記季既|jia1 家加|jian1 間|jian4 見建件|jiang1 將|jiao1 教|jiao4 叫覺|jie2 節|jie3 姐|jie4 介|jin1 今津|jin3 緊儘|jin4 近進|jing1 經|jing4 境靜|jiu3 九久|jiu4 就|ju3 舉|jue2 覺決|ka3 卡|ka1 咖|kai1 開|kan4 看|ke3 可|ke4 客課|kong1 空|kou3 口|kuai4 快塊|la5 啦|lai2 來|lao3 老|le5 了|leng3 冷|li3 李里理|li4 力歷|lian2 連|liang3 兩|liang4 亮|liao3 了|lin2 林|liu4 六|lou2 樓|lu4 路鹿|lu3 魯|lü3 旅|lü4 綠|ma1 媽|ma3 馬|ma5 嗎|mai3 買|mai4 賣|man4 慢|mang2 忙|mao1 貓|mao2 毛|me5 麼|mei2 沒|mei3 美每|mei4 妹|men2 門|men5 們|mi3 米|min2 民|ming2 明名|mu4 目|na3 哪|na4 那|nai3 奶|nan2 難|ne5 呢|neng2 能|ni3 你|nian2 年|niu2 牛|ou1 喔|pai1 拍|pao3 跑|peng2 朋|pian2 便|pian4 片|piao4 票漂|qi1 七|qi2 其期|qi3 起|qi4 氣|qian2 前錢|qian3 淺|qiu2 球|qu4 去|ran2 然|re4 熱|ren2 人|ren4 認|reng2 仍|ri4 日|rou4 肉|ru2 如|ru4 入|san1 三|san3 傘|sha1 沙|shan1 山|shang4 上|shao3 少|shao4 紹|shei2 誰|shen2 什|sheng1 生聲|sheng3 省|shi1 師虱|shi2 十時識石|shi3 使|shi4 是事市試室視|shou3 手|shou4 售|shu1 書舒|shu4 樹|shui3 水|shui4 睡|shuo1 說|si1 思|si4 四|song1 鬆|song4 送|su2 俗|su4 素|sui1 雖|sui2 隨|ta1 他她牠它|tai2 臺颱|tai4 太|tang1 湯|tao3 討|ti2 題|tian1 天|tian2 田甜|tiao2 條|ting1 聽|ting2 停|tong2 同|tou2 頭|tou1 偷|wai4 外|wan2 玩完|wan3 晚|wang2 王|wang4 忘|wei2 危|wei4 為|wen2 文聞|wen4 問|wo3 我|wu2 無|wu3 五午|wu4 物|xi1 西息希|xi2 習|xi3 喜洗|xi4 夕|xia4 下夏|xian1 先|xian4 現|xiang1 香|xiang3 想|xiang4 像|xiao3 小|xiao4 校笑|xie1 些|xie2 鞋|xie4 謝|xin1 新心|xing1 星|xing2 行|xing4 興|xiu1 休|xu1 需|xue2 學|ya2 牙|yan2 顏|yan4 驗|yang2 陽|yang4 樣|yao4 要|ye3 也野|ye4 夜業|yi1 一衣醫|yi2 宜|yi3 已以|yi4 意藝議|yin1 因音|yin2 銀|ying1 英|ying2 迎|yong4 用|you2 遊郵|you3 有友|you4 又右|yu2 魚於|yu3 語雨與|yu4 遇|yuan2 原園|yuan3 遠|yue4 月|yue1 約|yue4 越樂|yun4 運|zai4 在再載|zao3 早|zen3 怎|zhan4 站|zhang1 張|zhang3 長|zhao3 找|zhao4 照|zhe4 這|zhe5 著|zhen1 珍真|zhen4 鎮|zheng4 正|zhi1 之知隻|zhi2 值直|zhi3 只紙|zhong1 中|zhong3 種|zhong4 重|zhou1 粥週|zhu4 住|zhuan3 轉|zhuang4 壯|zi4 自|zi5 子|zou3 走|zu2 族|zui4 最|zuo2 昨|zuo4 坐做作|bao3 寶飽|hua2 華|mao4 冒|xian3 險顯|jing1 精|shen2 神|hui1 徽恢|zhang1 章|qie1 切|huan4 換|pin1 拼|zhu4 注祝|bi4 閉|xuan3 選|xi4 戲系|tu2 圖|xiang4 向項|jian4 鍵鑑|yi2 移|que4 確雀鵲|zuo3 左|qu3 取|xiao1 消|nei4 內|rong2 容|yi1 依|dai4 代待|cheng2 程城成|ge4 各|ce4 冊測|zhu3 主|bian1 編|pai2 排|chuang4 創|lian4 練煉|ju4 句|shi4 式示|ban3 版闆|qing3 請|hui4 匯彙|shou4 授|quan2 權全|ci2 詞|biao3 表|bei3 北|zhao1 招|jie2 捷|zhun3 準|bei4 備倍|yan2 言|wan1 灣|ke4 克|na4 娜|zhu2 竹|shu4 數術|zi4 字|can1 餐參|fen1 分|guang1 光|lin2 臨|bing3 餅|da2 答達|he2 盒和|bei1 杯|cha2 茶查|qie3 且|jia1 嘉|yi4 義|jiao1 交|tong1 通|wu1 嗚|gai4 概|jiao4 較|tao4 套|mian4 面|qi2 騎旗|nan2 南|fu4 傅復|ji1 蹟基|chao1 超|zhe3 者|gong1 工恭|fu2 服福|xiong2 雄|nao4 鬧|qing1 輕清|ban1 班搬|hu4 護戶|dui4 對|qing2 晴|you2 油由|zhong1 鐘忠|jing3 景|se4 色|lan2 藍|na2 拿|mo4 末|liao2 聊|lei4 累|diao4 掉|li3 裡|fa1 發|lian3 臉|lian2 蓮聯|ge2 閣|xia2 峽|gu3 谷|jie3 解|hua4 化|si1 司|su4 宿速|xing4 姓|ying3 影|zhu1 珠|fei1 啡|ju2 局|pang2 旁|guan4 慣冠|gao1 糕|suo3 所|guo3 果|tong4 痛|ji4 計繼際|chu3 礎|jie1 階|chen2 陳|bo4 播|liu2 流|li4 利|sai4 賽|guan3 管|meng2 盟|jun1 軍|huang2 黃|bao4 抱|yuan4 怨|chang3 場|zhan4 戰|shan1 刪|cuo4 錯|wu4 誤|ju1 居|gou3 狗|huo3 夥|ban4 伴|huo2 活|san4 散|bu4 步部|ma2 麻嬤|er3 耳|duo3 朵|ge1 歌|niao3 鳥|hu3 虎|shou3 守|xian4 限|yu4 育預|sen1 森|ji2 吉|xiang2 祥|fei4 費|shun4 順|kao3 考|shua1 刷|shang1 商|yuan2 員|tiao3 挑|miao4 廟|chou1 抽|zhi1 支|qian1 籤|cao3 草|cong2 叢|bian4 變遍|qiang2 強|yue4 閱|du2 讀|biao1 標|tai2 台|cun2 存|dang3 檔|ling2 零|shi2 食|ke1 棵顆|sheng1 升|zhuang1 裝|zhi4 置|gai3 改|jian3 減簡|xu4 續|e2 額|tiao4 跳|shi3 始|tao2 逃|ying2 贏|huo4 或|wei4 餵|zeng1 增|man3 滿|xun2 馴|yang3 養|li2 離|xiang1 相|dao3 倒|wang3 往|xiu1 修|bang4 棒|ping2 評|shen3 審|she4 設|fan3 返|da1 搭|ying1 應|lu4 錄|tong3 統|an4 按|jiao3 角|ke1 科|ji4 技|fen3 粉|yi2 姨|nong2 農|yang2 羊|xue3 雪|sun1 孫|zuo4 座|he2 河|xia1 蝦|juan3 捲|bo2 駁博|qu1 區|cang1 倉|ku4 庫|shu3 暑|wang3 網|huan2 環|qun2 群|tan1 灘|qi2 淇|chun1 春|tie1 貼|diao4 調|pi2 皮|zhuo1 桌|ku1 哭|shou4 受|zheng4 政|fu3 府|yuan4 院|li4 麗|xiang1 鄉|sui4 歲|xiong1 兄|qu4 趣|la4 辣|zhe2 折|yin1 陰|liang2 涼粱|wu4 霧|di1 低|sai1 塞|qiao2 橋|ji4 紀|pin3 品|bao3 堡|geng4 更|cha4 差|ze2 擇|jia4 價|wu3 舞|fang2 房|shao1 燒|du4 肚|pa4 怕|e4 餓|shen4 甚|zhi4 至|luo4 落|jiu3 酒|sao3 掃|zheng3 整|la1 垃|ji1 圾|xiang1 箱|lei4 類|diu1 丟|nong4 弄|jian3 撿|ma4 罵|xing3 醒|jing3 警|cha2 察|zhua1 抓|mi4 祕密|jie1 街|yuan4 願|xie3 寫|xin1 薪|zu1 租|ya1 壓|ci3 此|xiang3 響|chan3 產|xi1 吸惜|yin3 引|yan2 延|ning4 寧|he2 何|kuang4 況|xi4 係|tu2 途|yu2 愉|gong4 共|chong3 寵|ping2 瓶|shi4 適|re4 熱|chang2 嘗|nan2 男|gui4 櫃|tai2 檯|bai4 敗|gua1 瓜|tao2 桃|kai3 凱|xian4 縣|ba4 爸|miao2 苗|li4 栗厲|mei2 莓|hu2 湖|zhai1 摘|pa2 爬|zhang1 彰|jiao1 嬌礁|yuan2 圓|fo2 佛|wan3 碗|tou2 投|shao4 邵|qing1 青|tan2 潭|chuan2 船傳|jiao3 腳|ta4 踏|huai4 壞|yun2 雲|tu3 土|cui4 脆|nü3 女|tie3 鐵|wei4 位未|ce4 廁|ting1 廳|juan1 娟|zhu3 煮|zao3 澡|shi3 史|chi4 赤|kan4 崁|ji3 擠己|peng2 澎|yu2 漁|suan4 算|fu1 夫|you2 游|yong3 泳|yan1 煙|shuang1 雙|hu4 滬|mu4 木|ping2 屏平|qi2 琪|ken3 墾|ding1 丁|jiu4 救|zong3 總|chong1 衝|lang4 浪|shai4 曬|ca1 擦|fang2 防|luan2 鑾|bi2 鼻|deng1 燈登|ta3 塔|jie1 接|shen1 身|ti3 體|lan2 蘭|de2 德|cong1 蔥|wen1 溫|quan2 泉|ba2 拔|xi1 溪|pao4 泡|gan1 乾|jing4 淨|fa3 髮|chui1 吹|long2 隆籠|fu4 婦|luo2 羅|lin2 淋|shi1 濕獅|fen1 芬|fen4 份|hong2 紅|dou3 陡|wa1 挖|jin1 金|jia4 假|xiang4 象|ye2 爺|te4 特|lu4 陸|zheng1 爭|min3 閩|zhu2 築|cun1 村|wang4 望|zhen4 震|gong4 貢|tang2 糖|jiang1 江|zu3 祖|yan3 眼|lei4 淚|rang4 讓|shi2 實|gou4 夠|hei1 黑|xiong2 熊|chi2 遲持|guai1 乖|bo2 伯|zai3 仔|ai1 哎|ya5 呀|shu1 輸|nian4 念|nuan3 暖|hai4 害|ni4 逆|zhen1 針|rao4 繞|quan1 圈|xun4 訓|pi2 疲|lao2 勞|bei1 背|yin3 飲|zhai2 宅|liang4 量|liao4 料|suo3 鎖|qiu2 求|bai4 拜|ju4 具|bing1 冰|qing2 情|pai2 牌`;
const PY_WORDS={'睡覺':'shui4 jiao4','覺得':'jue2 de5','銀行':'yin2 hang2','了解':'liao3 jie3','值得':'zhi2 de2','便宜':'pian2 yi2','長大':'zhang3 da4','東西':'dong1 xi1','什麼':'shen2 me5','為什麼':'wei4 shen2 me5','認為':'ren4 wei2','因為':'yin1 wei4','還是':'hai2 shi4','音樂':'yin1 yue4','快樂':'kuai4 le4','星期':'xing1 qi2','一言為定':'yi4 yan2 wei2 ding4','載你':'zai4 ni3','不了':'bu4 liao3','得到':'de2 dao4','行李':'xing2 li3','銀':'yin2','少年':'shao4 nian2','種茶':'zhong4 cha2','種草莓':'zhong4 cao3 mei2','有空':'you3 kong4','頭髮':'tou2 fa3','重新':'chong2 xin1','垃圾':'le4 se4','暖和':'nuan3 huo5','睡著':'shui4 zhao2','調皮':'tiao2 pi2'};

// ==================== art.js ====================
// ===== 繪圖：地面、樹、建築、人物、動物、徽章 =====
const OUT='#2a2238';
function rng(seed){return()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296)}
function hex2rgb(h){if(h.startsWith('rgb'))return h.match(/\d+/g).slice(0,3).map(Number);h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function shade(h,a){const[r,g,b]=hex2rgb(h);const f=v=>Math.round(a>=0?v+(255-v)*a:v*(1+a));return`rgb(${f(r)},${f(g)},${f(b)})`}
function rr(c,x,y,w,h,r){c.beginPath();if(w<0){x+=w;w=-w}if(h<0){y+=h;h=-h}r=Math.max(0,Math.min(r,w/2,h/2));c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function fs(c,fill,lw){if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=OUT;c.lineJoin='round';c.stroke()}}
function circ(c,x,y,r){c.beginPath();c.arc(x,y,r,0,Math.PI*2)}
function ell(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2)}
function lg(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g}

/* 中文字在畫布上：依設定加拼音或注音 */
function canvasRuby(c,text,cx,cy,size,color,stroke){const segs=segment(text);const mode=S?S.settings.ruby:'pinyin';
 c.save();c.textAlign='center';c.textBaseline='alphabetic';const n=segs.length,w=size*1.02;let x=cx-(n*w)/2+w/2;
 segs.forEach(([ch,syl])=>{c.font=`900 ${size}px "Noto Sans TC",sans-serif`;
  if(stroke){c.lineWidth=size*.18;c.strokeStyle=stroke;c.strokeText(ch,x,cy)}c.fillStyle=color;c.fillText(ch,x,cy);
  if(mode!=='off'&&syl){const t=mode==='zhuyin'?toZhu(syl):toMark(syl);c.font=`700 ${size*.36}px "Noto Sans TC",sans-serif`;
   if(stroke){c.lineWidth=size*.1;c.strokeText(t,x,cy-size*.95)}c.fillText(t,x,cy-size*.95)}
  x+=w});c.restore()}

/* ---------- 地面 ---------- */
const GT={G:0,TG:1,PD:2,PB:3,WA:4,FL:5};
function paintGround(m,ci,u,dpr){const cv=document.createElement('canvas');cv.width=Math.ceil(W*u*dpr);cv.height=Math.ceil(H*u*dpr);
 const g=cv.getContext('2d');g.scale(dpr,dpr);const r=rng(ci*977+5);
 g.fillStyle='#8bd36b';g.fillRect(0,0,W*u,H*u);
 for(let i=0;i<90;i++){const x=r()*W*u,y=r()*H*u,rad=u*(1.2+r()*3);const gr=g.createRadialGradient(x,y,0,x,y,rad);
  const col=r()<.5?'rgba(66,150,70,.16)':'rgba(214,246,150,.20)';gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2)}
 g.lineCap='round';
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(m[y][x]!==GT.G&&m[y][x]!==GT.FL)continue;for(let k=0;k<4;k++){const px=(x+r())*u,py=(y+r())*u;g.strokeStyle=r()<.5?'#68b956':'#a6e07f';g.lineWidth=u*.035;
  g.beginPath();g.moveTo(px-u*.05,py-u*.08);g.lineTo(px,py);g.lineTo(px+u*.05,py-u*.09);g.stroke()}}
 const isP=(x,y)=>{const t=m[y]?.[x];return t===GT.PD||t===GT.PB};
 // dirt
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.PD){g.fillStyle='#ecd6a4';g.fillRect(x*u,y*u,u+.5,u+.5);
  for(let k=0;k<3;k++){ell(g,(x+r())*u,(y+r())*u,u*.05,u*.03);g.fillStyle='#d8bd86';g.fill()}}
 // bricks
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.PB){g.fillStyle='#ece3d3';g.fillRect(x*u,y*u,u+.5,u+.5);g.strokeStyle='#d6c9b1';g.lineWidth=1;
  for(let row=0;row<4;row++){const yy=y*u+row*u/4;g.beginPath();g.moveTo(x*u,yy);g.lineTo(x*u+u,yy);g.stroke();const off=(row%2)*u/4;
   for(let k=0;k<2;k++){const xx=x*u+off+k*u/2;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,yy+u/4);g.stroke()}}}
 // edges of paths
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=m[y][x];if(t!==GT.PD&&t!==GT.PB)continue;const col=t===GT.PB?'#b7aa92':'#c9a86e';
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{const n=m[y+dy]?.[x+dx];if(n===undefined||n===GT.PD||n===GT.PB)return;
   g.fillStyle=col;const th=u*.07;if(dy===-1)g.fillRect(x*u,y*u,u,th);if(dy===1)g.fillRect(x*u,y*u+u-th,u,th);if(dx===-1)g.fillRect(x*u,y*u,th,u);if(dx===1)g.fillRect(x*u+u-th,y*u,th,u);
   g.strokeStyle='#5fb04f';g.lineWidth=u*.04;for(let k=0;k<3;k++){const f=r();let px,py;if(dy)px=(x+f)*u,py=(dy<0?y:y+1)*u;else px=(dx<0?x:x+1)*u,py=(y+f)*u;
    g.beginPath();g.moveTo(px,py);g.lineTo(px+(dx||(r()-.5))*u*.1,py+(dy||(r()-.5))*u*.1);g.stroke()}})}
 // water
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.WA){const gr=g.createLinearGradient(0,y*u,0,y*u+u);gr.addColorStop(0,'#5cc0f0');gr.addColorStop(1,'#3a9ed9');g.fillStyle=gr;g.fillRect(x*u,y*u,u+.5,u+.5);
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{if(m[y+dy]?.[x+dx]===GT.WA)return;g.fillStyle='#d7f3ff';const th=u*.09;
   if(dy===-1){g.fillStyle='#7b6a4f';g.fillRect(x*u,y*u,u,th*1.4);g.fillStyle='#d7f3ff';g.fillRect(x*u,y*u+th*1.4,u,th*.6)}
   if(dy===1)g.fillRect(x*u,y*u+u-th,u,th);if(dx===-1)g.fillRect(x*u,y*u,th,u);if(dx===1)g.fillRect(x*u+u-th,y*u,th,u)})}
 // flowers
 const FC=['#ffffff','#ffd84a','#ff8fb6','#ff6b5a'];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.FL)for(let k=0;k<3;k++){const px=(x+.2+r()*.6)*u,py=(y+.2+r()*.6)*u,col=FC[Math.floor(r()*4)];
  for(let p=0;p<5;p++){const a=p/5*Math.PI*2;circ(g,px+Math.cos(a)*u*.05,py+Math.sin(a)*u*.05,u*.045);g.fillStyle=col;g.fill()}circ(g,px,py,u*.03);g.fillStyle='#f2a12e';g.fill()}
 // tall grass
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.TG)drawTallGrass(g,x*u,y*u,u,r,false);
 return cv}
function drawTallGrass(g,x0,y0,u,r,front){if(!front){g.fillStyle='#3f9a44';rr(g,x0+u*.02,y0+u*.1,u*.96,u*.9,u*.18);g.fill()}
 const cols=['#2f8239','#46a84a','#5cbf55','#78d266'];g.lineCap='round';
 const rows=front?[.62,.86]:[.3,.55,.8];rows.forEach((ry,ri)=>{for(let k=0;k<5;k++){const bx=x0+(k+.5+(r()-.5)*.4)*u/5,by=y0+ry*u+u*.16,hgt=u*(.32+r()*.14),lean=(r()-.5)*u*.14;
  g.strokeStyle=cols[Math.min(3,ri+(r()<.4?1:0))];g.lineWidth=u*.085;g.beginPath();g.moveTo(bx,by);g.quadraticCurveTo(bx+lean*.3,by-hgt*.6,bx+lean,by-hgt);g.stroke();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=u*.025;g.beginPath();g.moveTo(bx-u*.01,by-hgt*.4);g.lineTo(bx+lean*.9,by-hgt*.95);g.stroke()}})}

/* ---------- 樹 ---------- */
function spriteTree(kind,u,dpr){const W2=2*u,H2=2.5*u;const cv=mkc(W2,H2,dpr);const c=cv.getContext('2d');const cx=u,by=2.42*u,lw=Math.max(1.2,u*.035);
 ell(c,cx+u*.08,by-u*.08,u*.62,u*.2);c.fillStyle='rgba(20,40,20,.22)';c.fill();
 if(kind==='palm'){c.lineCap='round';c.strokeStyle=OUT;c.lineWidth=u*.24;c.beginPath();c.moveTo(cx,by-u*.1);c.quadraticCurveTo(cx+u*.25,by-u*.9,cx+u*.05,by-u*1.65);c.stroke();
  c.strokeStyle='#a8784a';c.lineWidth=u*.17;c.stroke();c.strokeStyle='#8c613a';c.lineWidth=u*.03;for(let k=1;k<7;k++){const t=k/7;const px=cx+u*.25*2*t*(1-t)+u*.05*t*t,py=by-u*.1-(u*1.55)*t;c.beginPath();c.moveTo(px-u*.08,py);c.lineTo(px+u*.08,py+u*.02);c.stroke()}
  const tx=cx+u*.05,ty=by-u*1.68;for(let k=0;k<8;k++){const a=-Math.PI/2+(k-3.5)*.48+(k%2?.1:0);const len=u*(.8+(k%3)*.12);const ex=tx+Math.cos(a)*len,ey=ty+Math.sin(a)*len*.75+u*.25;
   c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*len*.5,ty+Math.sin(a)*len*.5-u*.25,ex,ey);c.quadraticCurveTo(tx+Math.cos(a)*len*.45+u*.06,ty+Math.sin(a)*len*.45-u*.08,tx,ty);fs(c,k%2?'#3f9f4b':'#58b85a',lw)}
  [[-.08,.05],[.1,.07],[0,.14]].forEach(([dx,dy])=>{circ(c,tx+dx*u,ty+dy*u,u*.08);fs(c,'#7a5230',lw*.7)});return cv}
 if(kind==='pine'){c.fillStyle='#7a5230';rr(c,cx-u*.1,by-u*.5,u*.2,u*.45,u*.05);fs(c,'#86603a',lw);
  const tiers=[[by-u*.35,.78,'#2d7a58'],[by-u*.9,.62,'#348a63'],[by-u*1.45,.46,'#3f9a70'],[by-u*1.95,.28,'#4aa979']];
  tiers.forEach(([y,wid,col])=>{c.beginPath();c.moveTo(cx-wid*u,y);c.quadraticCurveTo(cx-wid*u*.4,y-u*.2,cx,y-u*.85);c.quadraticCurveTo(cx+wid*u*.4,y-u*.2,cx+wid*u,y);c.quadraticCurveTo(cx,y+u*.12,cx-wid*u,y);fs(c,col,lw);
   c.beginPath();c.moveTo(cx+u*.05,y-u*.7);c.quadraticCurveTo(cx+wid*u*.35,y-u*.2,cx+wid*u*.75,y-u*.03);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=u*.05;c.stroke()});return cv}
 c.fillStyle='#86603a';rr(c,cx-u*.12,by-u*.75,u*.24,u*.7,u*.06);fs(c,lg(c,cx-u*.12,0,cx+u*.12,0,['#8c643c','#6d4b2a']),lw);
 const blobs=[[0,-1.25,.62],[-.42,-1.05,.42],[.42,-1.02,.44],[-.22,-1.55,.42],[.24,-1.58,.4]];
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u,by+dy*u,rad*u+lw);c.fillStyle=OUT;c.fill()});
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u,by+dy*u,rad*u);c.fillStyle='#2f8a3e';c.fill()});
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u-rad*u*.15,by+dy*u-rad*u*.18,rad*u*.78);c.fillStyle='#46a84c';c.fill()});
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u-rad*u*.32,by+dy*u-rad*u*.36,rad*u*.36);c.fillStyle='#7cd36a';c.fill()});
 return cv}
function mkc(w,h,dpr){const cv=document.createElement('canvas');cv.width=Math.ceil(w*dpr);cv.height=Math.ceil(h*dpr);cv.getContext('2d').scale(dpr,dpr);cv._w=w;cv._h=h;return cv}

/* ---------- 小物件 ---------- */
function spriteLamp(u,dpr){const cv=mkc(u,2*u,dpr),c=cv.getContext('2d'),lw=Math.max(1.2,u*.035),cx=u/2,by=1.92*u;
 ell(c,cx,by-u*.04,u*.2,u*.07);c.fillStyle='rgba(0,0,0,.2)';c.fill();
 rr(c,cx-u*.05,by-u*1.55,u*.1,u*1.5,u*.04);fs(c,'#3d4766',lw);rr(c,cx-u*.12,by-u*.18,u*.24,u*.16,u*.04);fs(c,'#3d4766',lw);
 const gr=c.createRadialGradient(cx,by-u*1.68,0,cx,by-u*1.68,u*.45);gr.addColorStop(0,'rgba(255,230,140,.55)');gr.addColorStop(1,'rgba(255,230,140,0)');c.fillStyle=gr;c.fillRect(0,0,u,u*1.2);
 rr(c,cx-u*.17,by-u*1.86,u*.34,u*.32,u*.1);fs(c,'#fff1b8',lw);c.beginPath();c.moveTo(cx-u*.22,by-u*1.84);c.lineTo(cx,by-u*1.98);c.lineTo(cx+u*.22,by-u*1.84);c.closePath();fs(c,'#3d4766',lw);return cv}
function spriteSign(u,dpr,col){const cv=mkc(u,1.2*u,dpr),c=cv.getContext('2d'),lw=Math.max(1.2,u*.035),by=1.12*u;
 ell(c,u/2,by-u*.03,u*.35,u*.08);c.fillStyle='rgba(0,0,0,.18)';c.fill();
 rr(c,u*.2,by-u*.5,u*.09,u*.48,u*.03);fs(c,'#8c643c',lw);rr(c,u*.71,by-u*.5,u*.09,u*.48,u*.03);fs(c,'#8c643c',lw);
 rr(c,u*.08,by-u*.98,u*.84,u*.56,u*.1);fs(c,'#f6e2b8',lw);rr(c,u*.16,by-u*.9,u*.68,u*.08,u*.04);c.fillStyle=col;c.fill();
 c.fillStyle='#c9a46a';for(let k=0;k<2;k++){rr(c,u*.2,by-u*(.74-k*.14),u*(.6-k*.18),u*.05,u*.02);c.fill()}return cv}
function spriteArch(u,dpr,city){const w=4*u,h=2.6*u;const cv=mkc(w,h,dpr),c=cv.getContext('2d'),lw=Math.max(1.4,u*.04);const red='#c8372d';
 [[.35],[3.45]].forEach(([px])=>{ell(c,px*u+u*.1,h-u*.05,u*.32,u*.09);c.fillStyle='rgba(0,0,0,.2)';c.fill();rr(c,px*u,h-u*1.95,u*.2,u*1.9,u*.05);fs(c,lg(c,px*u,0,px*u+u*.2,0,[shade(red,.15),shade(red,-.25)]),lw);rr(c,px*u-u*.06,h-u*.22,u*.32,u*.18,u*.04);fs(c,'#8f8a80',lw)});
 rr(c,u*.15,h-u*2.05,w-u*.3,u*.22,u*.05);fs(c,red,lw);
 c.beginPath();c.moveTo(0,h-u*2.05);c.quadraticCurveTo(u*.4,h-u*2.2,u*.6,h-u*2.5);c.lineTo(w-u*.6,h-u*2.5);c.quadraticCurveTo(w-u*.4,h-u*2.2,w,h-u*2.05);c.closePath();fs(c,'#2f9a6a',lw);
 c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=u*.03;for(let k=1;k<10;k++){c.beginPath();c.moveTo(u*.6+k*(w-u*1.2)/10,h-u*2.45);c.lineTo(u*.4+k*(w-u*.8)/10,h-u*2.1);c.stroke()}
 rr(c,w/2-u*1.05,h-u*1.85,u*2.1,u*.62,u*.08);fs(c,'#ffd35a',lw);
 canvasRuby(c,city.zh,w/2,h-u*1.33,u*.36,OUT);return cv}

/* ---------- 建築 ---------- */
const BLD={gym:{w:7,h:5,ex:1.3},inn:{w:6,h:5,ex:1.4},store:{w:5,h:4,ex:.7},tea:{w:4,h:3,ex:1},temple:{w:6,h:4,ex:1.6},house:{w:3,h:4,ex:1.8}};
function spriteBuilding(kind,u,dpr,city,emblemImg){const b=BLD[kind];const w=b.w*u,h=(b.h+b.ex)*u;const cv=mkc(w,h,dpr);const c=cv.getContext('2d');const lw=Math.max(1.4,u*.04);
 const door=(cx,dw,dh,col1,col2)=>{rr(c,cx-dw/2,h-dh,dw,dh,u*.06);fs(c,lg(c,0,h-dh,0,h,[col1,col2]),lw);c.beginPath();c.moveTo(cx,h-dh);c.lineTo(cx,h);c.strokeStyle=OUT;c.lineWidth=lw;c.stroke();
  c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.moveTo(cx-dw/2+u*.08,h-dh+u*.1);c.lineTo(cx-dw/2+u*.22,h-dh+u*.1);c.lineTo(cx-dw/2+u*.08,h-dh+u*.4);c.fill()};
 const win=(x,y,ww,wh,grille)=>{rr(c,x,y,ww,wh,u*.05);fs(c,lg(c,0,y,0,y+wh,['#bfe8ff','#6fb7e6']),lw);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(x+ww*.12,y+wh*.15,ww*.14,wh*.5);
  if(grille){c.strokeStyle='#5c6680';c.lineWidth=u*.025;for(let k=1;k<5;k++){c.beginPath();c.moveTo(x+ww*k/5,y);c.lineTo(x+ww*k/5,y+wh);c.stroke()}c.beginPath();c.moveTo(x,y+wh/2);c.lineTo(x+ww,y+wh/2);c.stroke()}};
 const plaque=(cx,cy,text,bg,fg,sz)=>{const pw=text.length*sz*1.08+sz*.6,ph=sz*(S&&S.settings.ruby==='off'?1.3:1.75);rr(c,cx-pw/2,cy-ph/2,pw,ph,u*.08);fs(c,bg,lw);canvasRuby(c,text,cx,cy+ph/2-sz*.32,sz,fg)};
 if(kind==='gym'){const roofC=city.roof,fy=h-2.3*u;
  c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.1,fy,w-u*.2,h-fy,u*.08);fs(c,lg(c,0,fy,0,h,['#ffffff','#dfe6f2']),lw);
  rr(c,u*.1,h-u*.32,w-u*.2,u*.32,u*.05);fs(c,roofC,lw);
  win(u*.45,fy+u*.55,w/2-u*1.55,u*.75);win(w/2+u*1.1,fy+u*.55,w/2-u*1.55,u*.75);
  [w/2-u*1.05,w/2+u*.85].forEach(px=>{rr(c,px,fy+u*.25,u*.2,h-fy-u*.25,u*.05);fs(c,'#f4f6fb',lw)});
  door(w/2,u*1.5,u*1.3,'#a9dcff','#4d8fd0');
  c.beginPath();c.moveTo(-u*.05,fy+u*.15);c.lineTo(u*.5,u*.45);c.quadraticCurveTo(w/2,-u*.05,w-u*.5,u*.45);c.lineTo(w+u*.05,fy+u*.15);c.closePath();fs(c,lg(c,0,0,0,fy,[shade(roofC,.35),roofC,shade(roofC,-.2)]),lw);
  c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=u*.05;for(let k=1;k<6;k++){c.beginPath();c.moveTo(u*.3+k*(w-u*.6)/6,u*.4);c.lineTo(k*w/6,fy+u*.1);c.stroke()}
  rr(c,-u*.05,fy+u*.05,w+u*.1,u*.2,u*.06);fs(c,'#ffd35a',lw);
  circ(c,w/2,fy*.52,u*.82);fs(c,'#ffffff',lw);if(emblemImg&&emblemImg.complete&&emblemImg.naturalWidth)c.drawImage(emblemImg,w/2-u*.78,fy*.52-u*.78,u*1.56,u*1.56);
  plaque(w/2,fy+u*.42,'道館','#1b2340','#ffffff',u*.3)}
 else if(kind==='inn'){const fy=u*.75;c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.15,fy,w-u*.3,h-fy,u*.06);fs(c,lg(c,0,0,w,0,['#fbeed3','#f1dcb4']),lw);
  c.strokeStyle='rgba(160,120,60,.18)';c.lineWidth=1;for(let y=fy+u*.25;y<h;y+=u*.25){c.beginPath();c.moveTo(u*.15,y);c.lineTo(w-u*.15,y);c.stroke()}
  rr(c,u*.05,u*.3,w-u*.1,fy-u*.15,u*.08);fs(c,'#c7ccd8',lw);rr(c,0,fy-u*.05,w,u*.18,u*.05);fs(c,'#e86a3a',lw);
  rr(c,w-u*1.3,u*.02,u*.7,u*.55,u*.12);fs(c,lg(c,w-u*1.3,0,w-u*.6,0,['#eef2f8','#9aa4b8']),lw);rr(c,u*.5,u*.35,u*.6,u*.3,u*.05);fs(c,'#e9edf4',lw);
  const floorH=(h-fy-u*.2)/3;for(let f=0;f<2;f++){const y=fy+u*.3+f*floorH;for(let k=0;k<4;k++){const wx=u*.45+k*(w-u*.9)/4;win(wx,y,(w-u*.9)/4-u*.3,floorH*.55)}
   if(f===1){c.strokeStyle=OUT;c.lineWidth=lw*.8;c.beginPath();c.moveTo(u*.35,y+floorH*.72);c.lineTo(w-u*.35,y+floorH*.72);c.stroke();for(let x=u*.4;x<w-u*.35;x+=u*.18){c.beginPath();c.moveTo(x,y+floorH*.72);c.lineTo(x,y+floorH*.9);c.stroke()}}}
  c.beginPath();c.moveTo(w/2-u*1.5,h-u*1.45);c.lineTo(w/2+u*1.5,h-u*1.45);c.lineTo(w/2+u*1.7,h-u*1.15);c.lineTo(w/2-u*1.7,h-u*1.15);c.closePath();fs(c,'#ff5b4a',lw);
  for(let k=0;k<6;k++){c.fillStyle=k%2?'#ff5b4a':'#ffffff';c.beginPath();const x0=w/2-u*1.7+k*u*3.4/6;c.moveTo(x0,h-u*1.15);c.lineTo(x0+u*3.4/6,h-u*1.15);c.lineTo(x0+u*3.4/12,h-u*1.02);c.fill()}
  door(w/2,u*1.3,u*1.0,'#d8f1ff','#7cb8e6');
  [u*.6,w-u*.9].forEach(px=>{rr(c,px,h-u*.45,u*.3,u*.4,u*.06);fs(c,'#b56a3a',lw);circ(c,px+u*.15,h-u*.62,u*.24);fs(c,'#4fae54',lw)});
  plaque(w/2,fy+u*.05+u*.0,'旅館','#ff5b4a','#ffffff',u*.34)}
 else if(kind==='store'){const fy=u*.7;c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.05,u*.1,w-u*.1,fy,u*.08);fs(c,'#d4d9e4',lw);rr(c,u*.6,u*.18,u*.7,u*.35,u*.05);fs(c,'#eef1f6',lw);
  rr(c,u*.1,fy,w-u*.2,h-fy,u*.06);fs(c,'#ffffff',lw);
  [['#14b3a4',0],['#ff9f2e',.22],['#ff5b4a',.36]].forEach(([col,o])=>{c.fillStyle=col;c.fillRect(u*.1+lw/2,fy+u*(.1+o),w-u*.2-lw,u*(o===0?.22:.14))});
  rr(c,u*.35,fy+u*.75,w-u*.7,h-fy-u*.85,u*.06);fs(c,lg(c,0,fy+u*.75,0,h,['#d6f0ff','#9fcff0']),lw);
  const sc=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'];for(let s=0;s<2;s++){c.fillStyle='rgba(27,35,64,.25)';c.fillRect(u*.45,fy+u*(1.25+s*.55),w-u*.9,u*.04);
   for(let k=0;k<12;k++){c.fillStyle=sc[(k+s*2)%5];c.fillRect(u*.5+k*(w-u*1)/12,fy+u*(1.05+s*.55),u*.12,u*.2)}}
  door(w/2,u*1.1,u*1.05,'rgba(214,240,255,.9)','rgba(140,200,240,.9)');
  plaque(w/2,fy+u*.42,'超商','#ffffff','#1b2340',u*.3)}
 else if(kind==='tea'){const fy=u*1.0;c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.15,fy,w-u*.3,h-fy,u*.06);fs(c,'#d9a066',lw);c.strokeStyle='rgba(120,70,30,.35)';c.lineWidth=1;for(let x=u*.15;x<w-u*.15;x+=u*.22){c.beginPath();c.moveTo(x,fy);c.lineTo(x,h);c.stroke()}
  c.beginPath();c.moveTo(0,fy+u*.1);c.lineTo(u*.3,u*.2);c.lineTo(w-u*.3,u*.2);c.lineTo(w,fy+u*.1);c.closePath();fs(c,'#8a5634',lw);
  c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=u*.03;for(let y=u*.35;y<fy;y+=u*.16){c.beginPath();c.moveTo(u*.2,y);c.lineTo(w-u*.2,y);c.stroke()}
  rr(c,u*.4,fy+u*.65,w-u*.8,u*.75,u*.06);fs(c,'#3a2a22',lw);rr(c,u*.4,fy+u*1.3,w-u*.8,u*.18,u*.04);fs(c,'#f6e2b8',lw);
  for(let k=0;k<3;k++){const px=u*.8+k*u*.9;rr(c,px,fy+u*.98,u*.26,u*.32,u*.05);fs(c,'#f3e6d0',lw*.7);ell(c,px+u*.13,fy+u*1.22,u*.1,u*.05);c.fillStyle='#3a2a22';c.fill()}
  const aw=fy+u*.35;for(let k=0;k<8;k++){c.beginPath();const x0=u*.1+k*(w-u*.2)/8,x1=x0+(w-u*.2)/8;c.moveTo(x0,aw);c.lineTo(x1,aw);c.lineTo(x1,aw+u*.22);c.arc((x0+x1)/2,aw+u*.22,(x1-x0)/2,0,Math.PI);c.closePath();fs(c,k%2?'#ffffff':'#ff5b4a',lw*.7)}
  rr(c,w/2-u*.45,fy-u*.5,u*.9,u*.7,u*.15);fs(c,'#fff6e0',lw);rr(c,w/2-u*.14,fy-u*.38,u*.28,u*.4,u*.06);fs(c,'#ffe0b0',lw*.7);c.fillStyle='#3a2a22';for(let k=0;k<3;k++){circ(c,w/2-u*.07+k*u*.07,fy-u*.06,u*.03);c.fill()}
  c.strokeStyle=OUT;c.lineWidth=lw*.8;c.beginPath();c.moveTo(w/2+u*.05,fy-u*.38);c.lineTo(w/2+u*.12,fy-u*.55);c.stroke();
  plaque(w-u*.75,h-u*.55,'茶','#1b2340','#ffffff',u*.3)}
 else if(kind==='temple'){const fy=h-2.05*u,red='#c8372d';c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,0,h-u*.32,w,u*.32,u*.04);fs(c,'#b9b2a4',lw);rr(c,w/2-u*1.1,h-u*.18,u*2.2,u*.18,u*.03);fs(c,'#d1cabd',lw);
  rr(c,u*.3,fy,w-u*.6,h-fy-u*.3,u*.04);fs(c,lg(c,0,fy,0,h,[shade(red,.1),shade(red,-.15)]),lw);
  rr(c,w/2-u*.8,fy+u*.55,u*1.6,h-fy-u*.85,u*.05);fs(c,'#6b3a1f',lw);c.beginPath();c.moveTo(w/2,fy+u*.55);c.lineTo(w/2,h-u*.3);c.strokeStyle=OUT;c.stroke();
  c.fillStyle='#ffd35a';for(let r2=0;r2<3;r2++)for(let k=0;k<3;k++){circ(c,w/2-u*.6+k*u*.2,fy+u*.8+r2*u*.3,u*.04);c.fill();circ(c,w/2+u*.2+k*u*.2,fy+u*.8+r2*u*.3,u*.04);c.fill()}
  [u*.55,w/2-u*1.2,w/2+u*.95,w-u*.8].forEach(px=>{rr(c,px,fy+u*.1,u*.25,h-fy-u*.4,u*.05);fs(c,lg(c,px,0,px+u*.25,0,['#e0473c','#9e2620']),lw)});
  [u*1.1,w-u*1.3].forEach(px=>{rr(c,px,fy+u*.7,u*.35,u*.55,u*.04);fs(c,'#8fc7a8',lw);c.strokeStyle='#2f6a52';c.lineWidth=u*.02;for(let k=1;k<4;k++){c.beginPath();c.moveTo(px+k*u*.087,fy+u*.7);c.lineTo(px+k*u*.087,fy+u*1.25);c.stroke()}});
  const ry=fy+u*.1;c.beginPath();c.moveTo(-u*.15,ry-u*.05);c.quadraticCurveTo(u*.4,ry,u*.7,ry-u*.6);c.lineTo(w-u*.7,ry-u*.6);c.quadraticCurveTo(w-u*.4,ry,w+u*.15,ry-u*.05);c.lineTo(w,ry+u*.12);c.lineTo(0,ry+u*.12);c.closePath();fs(c,lg(c,0,ry-u*.6,0,ry,['#f6a443','#d86f1f']),lw);
  c.strokeStyle='rgba(120,50,10,.35)';c.lineWidth=u*.03;for(let k=1;k<14;k++){c.beginPath();c.moveTo(u*.7+k*(w-u*1.4)/14,ry-u*.58);c.lineTo(k*w/14,ry+u*.1);c.stroke()}
  const ry2=ry-u*.75;c.beginPath();c.moveTo(u*.3,ry2+u*.2);c.quadraticCurveTo(u*.9,ry2+u*.12,u*1.2,ry2-u*.55);c.lineTo(w-u*1.2,ry2-u*.55);c.quadraticCurveTo(w-u*.9,ry2+u*.12,w-u*.3,ry2+u*.2);c.lineTo(w-u*.6,ry2+u*.2);c.lineTo(u*.6,ry2+u*.2);c.closePath();fs(c,lg(c,0,ry2-u*.55,0,ry2,['#f6a443','#d86f1f']),lw);
  rr(c,u*.9,ry2-u*.68,w-u*1.8,u*.16,u*.06);fs(c,'#2f9a6a',lw);
  c.beginPath();c.moveTo(u*.9,ry2-u*.6);c.quadraticCurveTo(u*.55,ry2-u*.7,u*.45,ry2-u*1.05);c.quadraticCurveTo(u*.8,ry2-u*.85,u*1.1,ry2-u*.66);fs(c,'#2f9a6a',lw);
  c.beginPath();c.moveTo(w-u*.9,ry2-u*.6);c.quadraticCurveTo(w-u*.55,ry2-u*.7,w-u*.45,ry2-u*1.05);c.quadraticCurveTo(w-u*.8,ry2-u*.85,w-u*1.1,ry2-u*.66);fs(c,'#2f9a6a',lw);
  circ(c,w/2,ry2-u*.82,u*.16);fs(c,'#ffd35a',lw);
  [u*1.6,w-u*1.6].forEach(px=>{c.strokeStyle=OUT;c.lineWidth=lw*.7;c.beginPath();c.moveTo(px,ry+u*.12);c.lineTo(px,ry+u*.3);c.stroke();ell(c,px,ry+u*.5,u*.17,u*.22);fs(c,'#ff4a3a',lw);c.fillStyle='#ffd35a';c.fillRect(px-u*.1,ry+u*.26,u*.2,u*.05);c.fillRect(px-u*.1,ry+u*.69,u*.2,u*.05)});
  plaque(w/2,fy+u*.3,'廟','#1b2340','#ffd35a',u*.32)}
 else if(kind==='house'){const fy=u*.95;c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.1,fy,w-u*.2,h-fy,u*.04);fs(c,'#f3efe6',lw);c.strokeStyle='rgba(120,110,90,.22)';c.lineWidth=1;for(let y=fy;y<h;y+=u*.14){c.beginPath();c.moveTo(u*.1,y);c.lineTo(w-u*.1,y);c.stroke()}for(let x=u*.1;x<w;x+=u*.14){c.beginPath();c.moveTo(x,fy);c.lineTo(x,h-u*1.2);c.stroke()}
  rr(c,0,u*.55,w,u*.5,u*.05);fs(c,'#c8ccd6',lw);rr(c,u*.35,u*.05,u*.9,u*.6,u*.18);fs(c,lg(c,u*.35,0,u*1.25,0,['#f5f7fb','#9aa3b6']),lw);c.strokeStyle='#8a93a6';c.lineWidth=u*.03;c.beginPath();c.moveTo(u*.35,u*.3);c.lineTo(u*1.25,u*.3);c.stroke();
  circ(c,w-u*.6,u*.55,u*.22);fs(c,'#56b45a',lw);
  for(let f=0;f<2;f++){const y=fy+u*.3+f*u*1.05;win(u*.45,y,w-u*.9,u*.62,true);if(f===0){rr(c,u*.3,y+u*.66,w-u*.6,u*.1,u*.03);fs(c,'#9aa3b6',lw*.8)}}
  rr(c,u*.25,h-u*1.15,w-u*.5,u*1.15,u*.03);fs(c,'#9aa3b6',lw);c.strokeStyle='#7a8398';c.lineWidth=u*.025;for(let y=h-u*1.1;y<h-u*.45;y+=u*.08){c.beginPath();c.moveTo(u*.3,y);c.lineTo(w-u*.3,y);c.stroke()}
  rr(c,w/2-u*.38,h-u*.95,u*.76,u*.95,u*.04);fs(c,'#c4322a',lw);
  c.fillStyle='#ff4a3a';rr(c,w/2-u*.62,h-u*.95,u*.17,u*.85,u*.02);fs(c,'#ff4a3a',lw*.6);rr(c,w/2+u*.45,h-u*.95,u*.17,u*.85,u*.02);fs(c,'#ff4a3a',lw*.6);rr(c,w/2-u*.45,h-u*1.12,u*.9,u*.15,u*.02);fs(c,'#ff4a3a',lw*.6);
  circ(c,w/2+u*.22,h-u*.5,u*.04);c.fillStyle='#ffd35a';c.fill()}
 return cv}

/* ---------- 人物 ---------- */
const SKIN='#ffd9b8';
function drawChar(c,cx,fy,s,L,dir,step,noShadow){const lw=Math.max(1.2,s*.035);c.save();c.lineJoin='round';c.lineCap='round';
 if(!noShadow){ell(c,cx,fy-s*.03,s*.3,s*.09);c.fillStyle='rgba(20,30,20,.25)';c.fill()}
 const side=dir==='left'||dir==='right',flip=dir==='left'?-1:1;const bob=step?s*.025:0;
 // legs
 const legY=fy-s*.32,legH=s*.29;
 if(!side){[-1,1].forEach(k=>{const lift=step&&((k<0)===(step>0))?s*.05:0;rr(c,cx+k*s*.1-s*.07,legY-lift,s*.14,legH,s*.06);fs(c,L.bottom,lw);rr(c,cx+k*s*.1-s*.08,fy-s*.1-lift,s*.16,s*.09,s*.04);fs(c,L.shoes||'#2b2d47',lw)})}
 else{[-1,1].forEach(k=>{const off=step?k*step*s*.08:0;rr(c,cx+off-s*.07,legY,s*.14,legH,s*.06);fs(c,shade(L.bottom,k<0?-.15:0),lw);rr(c,cx+off-s*.07+flip*s*.02,fy-s*.1,s*.18,s*.09,s*.04);fs(c,L.shoes||'#2b2d47',lw)})}
 const ty=fy-s*.68-bob;
 if(L.pack&&dir!=='down'){rr(c,cx-(side?flip*s*.32:s*.2)-(side?s*.08:0),ty+s*.06,side?s*.18:s*.4,s*.34,s*.08);fs(c,L.pack,lw)}
 // arms back
 const armSwing=step?step*s*.04:0;
 if(side){rr(c,cx-flip*s*.02-s*.06,ty+s*.06-armSwing,s*.12,s*.3,s*.06);fs(c,shade(L.top,-.2),lw)}
 // torso
 rr(c,cx-(side?s*.17:s*.22),ty,side?s*.34:s*.44,s*.4,s*.13);fs(c,lg(c,cx-s*.22,0,cx+s*.22,0,[shade(L.top,.12),L.top,shade(L.top,-.15)]),lw);
 if(L.skirt){c.beginPath();c.moveTo(cx-s*.2,ty+s*.3);c.lineTo(cx+s*.2,ty+s*.3);c.lineTo(cx+s*.27,ty+s*.5);c.lineTo(cx-s*.27,ty+s*.5);c.closePath();fs(c,L.skirt,lw)}
 if(dir==='down'){c.beginPath();c.moveTo(cx-s*.09,ty+s*.01);c.lineTo(cx,ty+s*.1);c.lineTo(cx+s*.09,ty+s*.01);c.strokeStyle=L.trim||'#ffffff';c.lineWidth=s*.04;c.stroke();
  c.beginPath();c.moveTo(cx,ty+s*.1);c.lineTo(cx,ty+s*.38);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=s*.02;c.stroke()}
 if(L.pack&&dir==='down'){[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.14,ty+s*.02);c.lineTo(cx+k*s*.12,ty+s*.3);c.strokeStyle=L.pack;c.lineWidth=s*.05;c.stroke()})}
 // arms front
 if(!side){[-1,1].forEach(k=>{const sw=step?k*step*s*.04:0;rr(c,cx+k*s*.27-s*.06,ty+s*.04+sw,s*.12,s*.3,s*.06);fs(c,shade(L.top,-.08),lw);circ(c,cx+k*s*.27,ty+s*.36+sw,s*.055);fs(c,SKIN,lw)})}
 else{rr(c,cx+flip*s*.03-s*.06,ty+s*.06+armSwing,s*.12,s*.3,s*.06);fs(c,shade(L.top,-.05),lw);circ(c,cx+flip*s*.03,ty+s*.38+armSwing,s*.055);fs(c,SKIN,lw)}
 // head
 const hy=fy-s*.98-bob,hr=s*.29;
 if(L.style==='pony'&&dir!=='up'){circ(c,cx-(side?flip*s*.27:0),hy+(side?s*.05:-s*.02)+(dir==='down'?0:0),s*.13);if(dir!=='down')fs(c,L.hair,lw)}
 if(L.style==='long'&&dir!=='up'){rr(c,cx-hr*1.08-(side?flip*hr*.25:0),hy-hr*.3,hr*2.16,hr*1.65,hr*.55);fs(c,L.hair,lw)}
 circ(c,cx,hy,hr);fs(c,SKIN,lw);
 c.fillStyle=L.hair;c.strokeStyle=OUT;c.lineWidth=lw;
 if(dir==='up'){circ(c,cx,hy-s*.01,hr*1.03);fs(c,L.hair,lw);if(L.style==='pony'){circ(c,cx,hy+s*.12,s*.12);fs(c,shade(L.hair,-.1),lw)}if(L.style==='long'){rr(c,cx-hr*1.02,hy-hr*.1,hr*2.04,hr*1.5,hr*.5);fs(c,L.hair,lw)}}
 else{c.beginPath();if(side){c.moveTo(cx+flip*hr*.55,hy-hr*.75);c.quadraticCurveTo(cx-flip*hr*1.25,hy-hr*1.1,cx-flip*hr*1.02,hy+hr*.45);c.quadraticCurveTo(cx-flip*hr*.5,hy+hr*.25,cx-flip*hr*.15,hy-hr*.05);c.quadraticCurveTo(cx+flip*hr*.4,hy-hr*.25,cx+flip*hr*1.0,hy-hr*.25);c.quadraticCurveTo(cx+flip*hr*.95,hy-hr*.75,cx+flip*hr*.55,hy-hr*.75)}
  else{c.moveTo(cx-hr*1.04,hy+hr*.15);c.quadraticCurveTo(cx-hr*1.15,hy-hr*1.15,cx,hy-hr*1.08);c.quadraticCurveTo(cx+hr*1.15,hy-hr*1.15,cx+hr*1.04,hy+hr*.15);c.quadraticCurveTo(cx+hr*.75,hy-hr*.25,cx+hr*.4,hy-hr*.35);c.quadraticCurveTo(cx+hr*.15,hy-hr*.1,cx,hy-hr*.38);c.quadraticCurveTo(cx-hr*.2,hy-hr*.1,cx-hr*.5,hy-hr*.32);c.quadraticCurveTo(cx-hr*.8,hy-hr*.2,cx-hr*1.04,hy+hr*.15)}
  c.closePath();fs(c,L.hair,lw);
  c.beginPath();c.arc(cx-hr*.3,hy-hr*.7,hr*.25,Math.PI*1.1,Math.PI*1.6);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=s*.03;c.stroke()}
 if(L.ribbon&&dir!=='up'){const rx=cx+(side?-flip*hr*.55:hr*.72),ry=hy-hr*.78;[-1,1].forEach(k=>{c.beginPath();c.moveTo(rx,ry);c.lineTo(rx+k*s*.09,ry-s*.05);c.lineTo(rx+k*s*.09,ry+s*.05);c.closePath();fs(c,L.ribbon,lw*.8)});circ(c,rx,ry,s*.03);fs(c,shade(L.ribbon,-.2),lw*.6)}
 if(L.style==='bun'){circ(c,cx,hy-hr*1.05,s*.11);fs(c,L.hair,lw)}
 if(L.style==='pony'&&dir==='down'){circ(c,cx+hr*.95,hy-hr*.2,s*.08);fs(c,L.hair,lw)}
 if(L.style==='cap'){c.beginPath();c.arc(cx,hy-hr*.18,hr*1.02,Math.PI*1.02,Math.PI*1.98);c.closePath();fs(c,L.cap||'#ff5b4a',lw);
  if(dir==='down'){ell(c,cx,hy-hr*.22,hr*.95,hr*.2);fs(c,shade(L.cap||'#ff5b4a',-.15),lw)}else if(side){ell(c,cx+flip*hr*.85,hy-hr*.22,hr*.55,hr*.15);fs(c,shade(L.cap||'#ff5b4a',-.15),lw)}
  circ(c,cx,hy-hr*.85,s*.04);c.fillStyle='#fff';c.fill()}
 // face
 if(dir==='down'){[-1,1].forEach(k=>{ell(c,cx+k*hr*.38,hy+hr*.18,s*.045,s*.065);c.fillStyle='#2a2238';c.fill();circ(c,cx+k*hr*.38-s*.012,hy+hr*.12,s*.016);c.fillStyle='#fff';c.fill();ell(c,cx+k*hr*.62,hy+hr*.45,s*.05,s*.025);c.fillStyle='rgba(255,120,120,.4)';c.fill()});
  c.beginPath();c.arc(cx,hy+hr*.45,s*.04,.15*Math.PI,.85*Math.PI);c.strokeStyle='#8a3a3a';c.lineWidth=s*.025;c.stroke()}
 else if(side){ell(c,cx+flip*hr*.5,hy+hr*.15,s*.04,s*.062);c.fillStyle='#2a2238';c.fill();circ(c,cx+flip*hr*.5-s*.01,hy+hr*.1,s*.014);c.fillStyle='#fff';c.fill();ell(c,cx+flip*hr*.55,hy+hr*.45,s*.045,s*.022);c.fillStyle='rgba(255,120,120,.4)';c.fill()}
 if(L.pack&&dir==='up'){rr(c,cx-s*.2,ty+s*.04,s*.4,s*.34,s*.08);fs(c,L.pack,lw);rr(c,cx-s*.12,ty+s*.18,s*.24,s*.12,s*.04);fs(c,shade(L.pack,-.15),lw)}
 c.restore()}

/* ---------- 動物 ---------- */
function drawAnimal(c,id,cx,fy,s){const lw=Math.max(1.4,s*.025);c.save();c.lineJoin='round';c.lineCap='round';
 ell(c,cx,fy-s*.02,s*.34,s*.07);c.fillStyle='rgba(20,30,20,.22)';c.fill();
 const eye=(x,y,r,col)=>{ell(c,x,y,r*.8,r);fs(c,col||'#2a2238');circ(c,x-r*.25,y-r*.35,r*.32);c.fillStyle='#fff';c.fill()};
 if(id==='cat'||id==='leopard'){const base=id==='cat'?'#f6a64a':'#c9a36b',dark=id==='cat'?'#d9772a':'#5a3a22';
  c.beginPath();c.moveTo(cx+s*.2,fy-s*.12);c.quadraticCurveTo(cx+s*.55,fy-s*.15,cx+s*.45,fy-s*.55);c.strokeStyle=OUT;c.lineWidth=s*.11;c.stroke();c.strokeStyle=base;c.lineWidth=s*.07;c.stroke();
  ell(c,cx,fy-s*.3,s*.26,s*.3);fs(c,base,lw);ell(c,cx,fy-s*.25,s*.13,s*.2);c.fillStyle='#fff3e0';c.fill();
  [-1,1].forEach(k=>{ell(c,cx+k*s*.1,fy-s*.05,s*.08,s*.05);fs(c,'#fff3e0',lw)});
  const hy=fy-s*.68;[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.08,hy-s*.18);c.lineTo(cx+k*s*.24,hy-s*.36);c.lineTo(cx+k*s*.26,hy-s*.08);c.closePath();fs(c,base,lw);c.beginPath();c.moveTo(cx+k*s*.12,hy-s*.18);c.lineTo(cx+k*s*.22,hy-s*.29);c.lineTo(cx+k*s*.22,hy-s*.12);c.fillStyle='#ffb4c4';c.fill()});
  ell(c,cx,hy,s*.27,s*.23);fs(c,base,lw);
  c.strokeStyle=dark;c.lineWidth=s*.03;if(id==='cat'){[-1,0,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.06,hy-s*.22);c.lineTo(cx+k*s*.06,hy-s*.14);c.stroke()});[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.24,fy-s*.36);c.lineTo(cx+k*s*.14,fy-s*.34);c.stroke()})}
  else{[[-.12,-.42],[.12,-.4],[-.18,-.25],[.17,-.22],[0,-.12],[-.1,-.32]].forEach(([dx,dy])=>{ell(c,cx+dx*s,fy+dy*s,s*.03,s*.022);c.fillStyle=dark;c.fill()});c.strokeStyle='#fff';c.lineWidth=s*.025;[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.04,hy-s*.2);c.lineTo(cx+k*s*.05,hy-s*.07);c.stroke()})}
  eye(cx-s*.1,hy+s*.01,s*.05,id==='cat'?'#3d7a3a':'#6a5a1a');eye(cx+s*.1,hy+s*.01,s*.05,id==='cat'?'#3d7a3a':'#6a5a1a');
  c.beginPath();c.moveTo(cx-s*.025,hy+s*.08);c.lineTo(cx+s*.025,hy+s*.08);c.lineTo(cx,hy+s*.11);c.closePath();c.fillStyle='#ff8fa6';c.fill();
  c.strokeStyle=OUT;c.lineWidth=s*.012;[-1,1].forEach(k=>{for(let j=0;j<2;j++){c.beginPath();c.moveTo(cx+k*s*.08,hy+s*(.1+j*.03));c.lineTo(cx+k*s*.3,hy+s*(.07+j*.06));c.stroke()}})}
 else if(id==='dog'){const base='#d9a463';
  c.beginPath();c.moveTo(cx+s*.2,fy-s*.2);c.quadraticCurveTo(cx+s*.42,fy-s*.4,cx+s*.3,fy-s*.55);c.strokeStyle=OUT;c.lineWidth=s*.12;c.stroke();c.strokeStyle=base;c.lineWidth=s*.08;c.stroke();
  ell(c,cx,fy-s*.3,s*.27,s*.3);fs(c,base,lw);ell(c,cx,fy-s*.3,s*.14,s*.22);c.fillStyle='#fff6e6';c.fill();[-1,1].forEach(k=>{ell(c,cx+k*s*.11,fy-s*.05,s*.09,s*.05);fs(c,'#fff6e6',lw)});
  const hy=fy-s*.7;[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.1,hy-s*.15);c.lineTo(cx+k*s*.22,hy-s*.38);c.lineTo(cx+k*s*.27,hy-s*.06);c.closePath();fs(c,shade(base,-.1),lw)});
  ell(c,cx,hy,s*.26,s*.23);fs(c,base,lw);ell(c,cx,hy+s*.1,s*.14,s*.1);fs(c,'#fff6e6',lw);
  eye(cx-s*.1,hy-s*.02,s*.045);eye(cx+s*.1,hy-s*.02,s*.045);ell(c,cx,hy+s*.05,s*.05,s*.035);c.fillStyle=OUT;c.fill();
  c.beginPath();c.ellipse(cx,hy+s*.16,s*.04,s*.05,0,0,Math.PI);fs(c,'#ff7a8a',lw*.7)}
 else if(id==='bird'||id==='magpie'){const mag=id==='magpie';const body=mag?'#2f6fe0':'#a77748',head=mag?'#1b1d2a':'#7a4f2a';
  if(mag){c.beginPath();c.moveTo(cx+s*.1,fy-s*.3);c.quadraticCurveTo(cx+s*.5,fy-s*.15,cx+s*.62,fy+s*.0);c.lineTo(cx+s*.5,fy+s*.04);c.quadraticCurveTo(cx+s*.38,fy-s*.1,cx+s*.05,fy-s*.2);fs(c,body,lw);
   [.32,.45,.56].forEach(t=>{ell(c,cx+s*t,fy-s*(.12-t*.2),s*.03,s*.02);c.fillStyle='#fff';c.fill()})}
  [-1,1].forEach(k=>{c.strokeStyle=mag?'#e8402e':'#d98a3a';c.lineWidth=s*.03;c.beginPath();c.moveTo(cx+k*s*.06,fy-s*.12);c.lineTo(cx+k*s*.06,fy-s*.02);c.lineTo(cx+k*s*.1,fy);c.stroke()});
  ell(c,cx,fy-s*.32,s*.25,s*.23);fs(c,body,lw);ell(c,cx,fy-s*.25,s*.15,s*.13);c.fillStyle=mag?'#ffffff':'#f1e2c0';c.fill();
  ell(c,cx+s*.13,fy-s*.33,s*.12,s*.15);fs(c,shade(body,-.12),lw);
  const hy=fy-s*.58;circ(c,cx-s*.04,hy,s*.17);fs(c,head,lw);if(!mag){ell(c,cx-s*.1,hy+s*.06,s*.08,s*.06);c.fillStyle='#ffffff';c.fill();ell(c,cx-s*.04,hy+s*.16,s*.06,s*.04);c.fillStyle='#2a2238';c.fill()}
  eye(cx-s*.09,hy-s*.02,s*.035,mag?'#ffd35a':'#2a2238');
  c.beginPath();c.moveTo(cx-s*.2,hy+s*.0);c.lineTo(cx-s*.32,hy+s*.04);c.lineTo(cx-s*.2,hy+s*.07);c.closePath();fs(c,mag?'#e8402e':'#e0a040',lw*.7)}
 else if(id==='bear'){const base='#24242c';
  ell(c,cx,fy-s*.3,s*.32,s*.3);fs(c,base,lw);c.beginPath();c.moveTo(cx-s*.14,fy-s*.48);c.lineTo(cx,fy-s*.36);c.lineTo(cx+s*.14,fy-s*.48);c.lineTo(cx+s*.1,fy-s*.5);c.lineTo(cx,fy-s*.42);c.lineTo(cx-s*.1,fy-s*.5);c.closePath();c.fillStyle='#f5ecd2';c.fill();
  [-1,1].forEach(k=>{ell(c,cx+k*s*.14,fy-s*.05,s*.1,s*.06);fs(c,base,lw)});
  const hy=fy-s*.7;[-1,1].forEach(k=>{circ(c,cx+k*s*.2,hy-s*.16,s*.09);fs(c,base,lw)});circ(c,cx,hy,s*.25);fs(c,base,lw);
  ell(c,cx,hy+s*.08,s*.12,s*.09);fs(c,'#c99a6a',lw);ell(c,cx,hy+s*.04,s*.045,s*.03);c.fillStyle='#111';c.fill();
  eye(cx-s*.1,hy-s*.05,s*.035,'#111');eye(cx+s*.1,hy-s*.05,s*.035,'#111')}
 c.restore()}

/* ---------- 徽章 ---------- */
const EMB={
 plane:'<path d="M50 20 L55 40 L78 53 L78 59 L55 51 L54 67 L61 73 L61 78 L50 74 L39 78 L39 73 L46 67 L45 51 L22 59 L22 53 L45 40 Z"/>',
 persimmon:'<circle cx="50" cy="56" r="19"/><path d="M36 40 Q43 32 50 38 Q57 32 64 40 Q57 44 50 41 Q43 44 36 40Z" fill-opacity=".85"/><rect x="48" y="28" width="4" height="10" rx="2"/>',
 wind:'<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M22 40 H58 a9 9 0 1 0 -9 -9"/><path d="M22 53 H70 a9 9 0 1 1 -9 9"/><path d="M28 66 H50"/></g>',
 strawberry:'<path d="M50 77 C33 68 27 53 31 43 C35 35 65 35 69 43 C73 53 67 68 50 77Z"/><path d="M35 40 L43 30 L50 37 L57 30 L65 40 Q50 46 35 40Z" fill-opacity=".8"/><g class="cut"><circle cx="42" cy="52" r="2"/><circle cx="56" cy="50" r="2"/><circle cx="48" cy="61" r="2"/><circle cx="60" cy="60" r="2"/><circle cx="44" cy="68" r="2"/><circle cx="54" cy="69" r="2"/></g>',
 suncake:'<g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M50 18v8M50 74v8M18 50h8M74 50h8M27 27l6 6M67 67l6 6M73 27l-6 6M33 67l-6 6"/></g><circle cx="50" cy="50" r="18"/><path class="cutS" d="M50 50 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6" fill="none" stroke-width="3"/>',
 buddha:'<circle cx="50" cy="31" r="8"/><circle cx="50" cy="22" r="4"/><path d="M50 40 C38 41 34 52 36 60 C29 62 25 69 27 74 H73 C75 69 71 62 64 60 C66 52 62 41 50 40Z"/>',
 lake:'<circle cx="37" cy="40" r="10"/><path d="M60 29 a11 11 0 1 0 8 19 a9 9 0 1 1 -8 -19Z"/><g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M22 62 q7 -6 14 0 t14 0 t14 0 t14 0"/><path d="M28 73 q6 -5 11 0 t11 0 t11 0 t11 0"/></g>',
 peanut:'<path d="M50 22 C63 22 66 35 59 44 C68 51 67 67 50 76 C33 67 32 51 41 44 C34 35 37 22 50 22Z"/><g class="cutS" fill="none" stroke-width="2.5"><path d="M44 32 L56 32M42 56 L58 56M43 64 L57 64"/></g>',
 sunrise:'<circle cx="60" cy="38" r="10"/><g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M60 20v-4M74 26l3-3M46 26l-3-3M80 38h4"/></g><path d="M18 74 L38 44 L48 56 L60 40 L82 74Z"/>',
 ricebowl:'<path d="M31 50 C33 37 67 37 69 50Z" fill-opacity=".85"/><path d="M24 50 H76 C74 65 63 73 50 73 C37 73 26 65 24 50Z"/><g stroke="#fff" stroke-width="3.5" stroke-linecap="round"><path d="M60 22 L74 44M66 20 L78 42"/></g>',
 tower:'<path d="M20 50 Q50 38 80 50 L76 54 L24 54Z"/><rect x="32" y="54" width="36" height="20" rx="2"/><path d="M30 34 Q50 24 70 34 L66 38 L34 38Z"/><rect x="38" y="38" width="24" height="12"/><circle cx="50" cy="22" r="3"/>',
 anchor:'<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><circle cx="50" cy="26" r="6"/><path d="M50 32 V74M38 42 H62M26 56 Q30 74 50 74 Q70 74 74 56"/></g>',
 hearts:'<g fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"><path d="M38 70 L22 52 a9 9 0 0 1 16 -10 a9 9 0 0 1 16 10Z"/><path d="M62 74 L46 56 a9 9 0 0 1 16 -10 a9 9 0 0 1 16 10Z"/></g>',
 lighthouse:'<path d="M42 76 L46 38 H54 L58 76Z"/><rect x="43" y="28" width="14" height="10" rx="2"/><path d="M41 28 L50 20 L59 28Z"/><g class="cut"><rect x="44" y="50" width="12" height="5"/><rect x="43" y="63" width="14" height="5"/></g><g fill="#fff" fill-opacity=".55"><path d="M57 31 L84 22 L84 40Z"/><path d="M43 31 L16 22 L16 40Z"/></g>',
 balloon:'<path d="M50 18 C30 18 24 38 32 50 C36 56 44 60 46 66 H54 C56 60 64 56 68 50 C76 38 70 18 50 18Z"/><g class="cutS" fill="none" stroke-width="2.5"><path d="M50 18 V66M40 22 Q36 44 46 66M60 22 Q64 44 54 66"/></g><rect x="44" y="70" width="12" height="9" rx="2"/><path d="M46 66 L45 70M54 66 L55 70" stroke="#fff" stroke-width="2"/>',
 gorge:'<path d="M18 26 H42 L44 50 L40 76 H18Z"/><path d="M82 26 H58 L56 52 L60 76 H82Z"/><path d="M42 68 q4 -4 8 0 t8 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
 turtle:'<path d="M20 62 C26 48 38 44 48 46 C54 34 66 33 72 42 C78 46 80 54 80 62Z"/><circle cx="70" cy="36" r="4"/><g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M18 72 q8 -6 16 0 t16 0 t16 0 t16 0"/></g>',
 umbrella:'<path d="M20 50 C20 30 80 30 80 50 C74 45 68 45 63 50 C58 45 54 45 50 50 C46 45 42 45 37 50 C32 45 26 45 20 50Z"/><path d="M50 50 V72 a5 5 0 0 1 -10 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><g fill="#fff"><circle cx="30" cy="62" r="2"/><circle cx="68" cy="66" r="2"/><circle cx="76" cy="58" r="2"/></g>',
 lantern:'<rect x="40" y="22" width="20" height="6" rx="2"/><rect x="40" y="70" width="20" height="6" rx="2"/><ellipse cx="50" cy="49" rx="20" ry="22"/><g class="cutS" fill="none" stroke-width="2.5"><path d="M50 27 V71M40 29 Q34 49 40 69M60 29 Q66 49 60 69"/></g><path d="M50 76 V84" stroke="#fff" stroke-width="3"/>',
 tower101:'<path d="M50 12 V22" stroke="#fff" stroke-width="3"/><path d="M44 22 H56 L54 28 H46Z"/><path d="M40 28 H60 L57 36 H43Z"/><path d="M40 36 H60 L57 44 H43Z"/><path d="M40 44 H60 L57 52 H43Z"/><path d="M40 52 H60 L57 60 H43Z"/><path d="M38 60 H62 L62 80 H38Z"/>',
 windlion:'<g>'+Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return`<circle cx="${(50+Math.cos(a)*19).toFixed(1)}" cy="${(42+Math.sin(a)*19).toFixed(1)}" r="7"/>`}).join('')+'</g><circle cx="50" cy="42" r="17"/><g class="cut"><circle cx="44" cy="39" r="3"/><circle cx="56" cy="39" r="3"/><path d="M44 50 Q50 55 56 50" fill="none" stroke-width="3"/></g><path d="M38 60 H62 L64 78 H36Z"/>',
 bluetears:'<path d="M18 58 q8 -10 16 0 t16 0 t16 0 t16 0 V78 H18Z"/><g fill="#bff3ff"><circle cx="28" cy="46" r="3"/><circle cx="44" cy="38" r="2.5"/><circle cx="60" cy="44" r="3.5"/><circle cx="74" cy="34" r="2.5"/><circle cx="36" cy="28" r="2"/><circle cx="66" cy="26" r="2"/></g>'
};
function badgeSVG(ci,got){const c=CITIES[ci];const col=got?c.roof:'#c9cfdd';const id='bg'+ci+(got?'g':'n');
 let e=EMB[c.emblem]||'';e=e.replace(/class="cut"/g,`fill="${col}" stroke="${col}"`).replace(/class="cutS"/g,`stroke="${col}"`);
 return`<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(col,.3)}"/><stop offset="1" stop-color="${shade(col,-.18)}"/></linearGradient></defs>
 <path d="M50 4 L88 22 L88 70 L50 96 L12 70 L12 22Z" fill="${got?'#ffc93c':'#e4e8f1'}" stroke="#1b2340" stroke-width="3"/><path d="M50 12 L81 27 L81 66 L50 88 L19 66 L19 27Z" fill="url(#${id})"/>
 <g fill="#fff" ${got?'':'opacity=".7"'}>${e}</g></svg>`}
function emblemImage(ci){const c=CITIES[ci];const e=(EMB[c.emblem]||'').replace(/class="cut"/g,`fill="${c.roof}" stroke="${c.roof}"`).replace(/class="cutS"/g,`stroke="${c.roof}"`).replace(/#fff\b/g,c.roof).replace(/fill="#bff3ff"/g,`fill="${c.roof}"`);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 80 80"><g fill="${c.roof}">${e}</g></svg>`;const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return img}

/* ---------- 室內 ---------- */
function paintInterior(M,u,dpr,city,emb){const w=M.w*u,h=M.h*u;const cv=document.createElement('canvas');cv.width=Math.ceil(w*dpr);cv.height=Math.ceil(h*dpr);const c=cv.getContext('2d');c.scale(dpr,dpr);
 const lw=Math.max(1.4,u*.04),k=M.bk;
 const FL={inn:['#d9a86c','#c8955a'],store:['#eef1f6','#dde3ec'],tea:['#c99a66','#b98a58'],temple:['#d8d0c0','#c6bca8'],gym:['#f4f6fb','#e3e8f2']}[k];
 c.fillStyle=FL[0];c.fillRect(0,0,w,h);
 if(k==='inn'||k==='tea'){const rr2=rng(7);for(let y=0;y<h;y+=u/3)for(let x=((y/(u/3))%2)*u*.7-u*1.4;x<w;x+=u*1.4){c.fillStyle=`rgba(${rr2()<.5?'255,255,255':'90,50,20'},${(rr2()*.08).toFixed(3)})`;c.fillRect(x,y,u*1.4,u/3)}c.strokeStyle=FL[1];c.lineWidth=2;for(let y=0;y<h;y+=u/3){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();for(let x=((y/(u/3))%2)*u*.7;x<w;x+=u*1.4){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+u/3);c.stroke()}}}
 else for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if((x+y)%2){c.fillStyle=FL[1];c.fillRect(x*u,y*u,u,u)}
 if(k==='gym'){c.fillStyle=shade(city.roof,.1);c.fillRect(4.6*u,2*u,1.8*u,h-2*u);c.fillStyle='#ffd35a';c.fillRect(4.6*u,2*u,u*.08,h-2*u);c.fillRect(6.32*u,2*u,u*.08,h-2*u);
  for(let y=4;y<M.h;y+=2){c.fillStyle='rgba(255,255,255,.18)';c.fillRect(4.7*u,y*u,1.6*u,u*.12)}}
 if(k==='inn'||k==='temple'){rr(c,3*u,5.2*u,5*u,2.6*u,u*.3);fs(c,k==='inn'?'#e86a3a':'#c8372d',lw);rr(c,3.25*u,5.45*u,4.5*u,2.1*u,u*.2);c.strokeStyle='#ffd35a';c.lineWidth=u*.05;c.stroke()}
 const WALL={inn:'#f6e7c8',store:'#ffffff',tea:'#7a5236',temple:'#b8312a',gym:shade(city.roof,.6)}[k];
 c.fillStyle=WALL;c.fillRect(0,0,w,2*u);c.fillStyle=shade(WALL,-.25);c.fillRect(0,2*u-u*.16,w,u*.16);
 // 牆面裝飾
 if(k==='inn'){rr(c,1.3*u,.35*u,1.6*u,1.1*u,u*.06);fs(c,'#8c643c',lw);rr(c,1.42*u,.47*u,1.36*u,.86*u,u*.04);fs(c,'#bfe6ff',lw*.6);c.beginPath();c.moveTo(1.42*u,1.33*u);c.lineTo(2*u,.75*u);c.lineTo(2.4*u,1.05*u);c.lineTo(2.78*u,.85*u);c.lineTo(2.78*u,1.33*u);c.closePath();fs(c,'#5fae4c');
  circ(c,8.8*u,.85*u,u*.42);fs(c,'#ffffff',lw);c.strokeStyle=OUT;c.lineWidth=lw;c.beginPath();c.moveTo(8.8*u,.85*u);c.lineTo(8.8*u,.6*u);c.moveTo(8.8*u,.85*u);c.lineTo(9*u,.95*u);c.stroke();
  rr(c,4*u,.25*u,3*u,1.1*u,u*.1);fs(c,'#ff5b4a',lw);canvasRuby(c,'櫃檯',5.5*u,1.15*u,u*.42,'#ffffff')}
 if(k==='store'){for(let r=0;r<2;r++){rr(c,.5*u,(.25+r*.8)*u,w-u,.6*u,u*.05);fs(c,'#e6eaf2',lw*.7);for(let i=0;i<26;i++){c.fillStyle=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'][(i+r)%5];c.fillRect(.65*u+i*(w-1.3*u)/26,(.33+r*.8)*u,(w-1.3*u)/26*.7,.42*u)}}
  rr(c,4*u,.05*u,3*u,.55*u,u*.1);fs(c,'#14b3a4',lw);canvasRuby(c,'歡迎光臨',5.5*u,.52*u,u*.3,'#ffffff')}
 if(k==='tea'){rr(c,1.2*u,.25*u,w-2.4*u,1.35*u,u*.1);fs(c,'#2a2d38',lw);const items=[['珍珠奶茶','60'],['紅茶','30'],['綠茶','30'],['冬瓜茶','35']];
  items.forEach(([n,p],i)=>{const x=(2+i*1.9)*u;canvasRuby(c,n,x+.6*u,1.25*u,u*.24,'#ffffff');c.fillStyle='#ffc93c';c.font=`800 ${u*.22}px sans-serif`;c.textAlign='center';c.fillText('$'+p,x+.6*u,1.52*u)})}
 if(k==='temple'){rr(c,3*u,.1*u,5*u,1.6*u,u*.08);fs(c,'#6b1a14',lw);rr(c,3.3*u,.3*u,4.4*u,1.3*u,u*.06);fs(c,lg(c,0,.3*u,0,1.6*u,['#ffd35a','#e0902b']),lw);
  for(let i=0;i<7;i++){c.strokeStyle='rgba(120,50,10,.35)';c.lineWidth=u*.03;c.beginPath();c.moveTo((3.5+i*.65)*u,.35*u);c.lineTo((3.5+i*.65)*u,1.55*u);c.stroke()}
  rr(c,4.4*u,.0*u,2.2*u,.55*u,u*.08);fs(c,'#1b2340',lw);canvasRuby(c,'平安',5.5*u,.48*u,u*.3,'#ffd35a');
  [1.6,9.4].forEach(x=>{c.strokeStyle=OUT;c.lineWidth=lw*.7;c.beginPath();c.moveTo(x*u,0);c.lineTo(x*u,.4*u);c.stroke();ell(c,x*u,.8*u,u*.3,u*.4);fs(c,'#ff4a3a',lw);c.fillStyle='#ffd35a';c.fillRect((x-.18)*u,.4*u,.36*u,u*.07);c.fillRect((x-.18)*u,1.15*u,.36*u,u*.07)})}
 if(k==='gym'){rr(c,3.5*u,.1*u,4*u,1.7*u,u*.12);fs(c,city.roof,lw);circ(c,5.5*u,.95*u,.7*u);fs(c,'#ffffff',lw);if(emb&&emb.complete&&emb.naturalWidth)c.drawImage(emb,4.85*u,.3*u,1.3*u,1.3*u);
  [[1.5],[8.5]].forEach(([x])=>{rr(c,(x-.5)*u,.2*u,u,1.5*u,u*.1);fs(c,'#ffffff',lw);canvasRuby(c,'道館',x*u,1.25*u,u*.3,OUT)})}
 // 側牆與下牆
 c.fillStyle=shade(WALL,-.4);c.fillRect(0,0,u*.5,h);c.fillRect(w-u*.5,0,u*.5,h);c.fillRect(0,h-u*.45,4.9*u,u*.45);c.fillRect(6.1*u,h-u*.45,w-6.1*u,u*.45);
 c.fillStyle=shade(WALL,-.55);c.fillRect(u*.42,2*u,u*.08,h-2*u);c.fillRect(w-u*.5,2*u,u*.08,h-2*u);
 rr(c,4.95*u,h-u*.85,1.1*u,u*.75,u*.1);fs(c,'#ff5b4a',lw);c.fillStyle='#fff';c.beginPath();c.moveTo(5.5*u,h-u*.2);c.lineTo(5.3*u,h-u*.5);c.lineTo(5.7*u,h-u*.5);c.fill();
 M.furn.filter(f=>f.t==='platform').forEach(f=>{const x=f.x*u,y=f.y*u,fw=f.w*u,fh=f.h*u;rr(c,x,y-u*.1,fw,fh,u*.15);fs(c,shade(city.roof,.35),lw);rr(c,x+u*.15,y+u*.05,fw-u*.3,fh-u*.35,u*.1);c.strokeStyle='#ffd35a';c.lineWidth=u*.05;c.stroke()});
 return cv}

/* ---------- 室內家具（逐一繪製、依深度排序） ---------- */
const FEX={counter:.75,shelf:1.35,sofa:.6,plant:1.05,table:.55,burner:1.05,pillar:1.75,dispenser:1,rack:.85,cushion:.15};
function spriteFurn(f,k,u,dpr,city){const ex=FEX[f.t]||.5,fw=f.w*u,fh=f.h*u,H2=fh+ex*u;const cv=mkc(fw,H2,dpr),c=cv.getContext('2d');const lw=Math.max(1.3,u*.035);const y0=ex*u,yb=H2;
 const shadow=(x,w2)=>{ell(c,x+w2/2,yb-u*.08,w2*.5,u*.13);c.fillStyle='rgba(30,20,10,.22)';c.fill()};
 if(f.t==='counter'){const P={inn:['#c79a6a','#8a5a36','#6b4226'],store:['#e3e8f2','#f7f9fc','#14b3a4'],tea:['#f0d2a8','#d9a873','#a8743f'],temple:['#d8473a','#a3271f','#ffd35a']}[k];
  c.fillStyle='rgba(30,20,10,.2)';c.fillRect(u*.1,yb-u*.12,fw,u*.14);
  rr(c,0,y0+u*.36,fw,fh-u*.36+u*.0,u*.06);fs(c,lg(c,0,y0,0,yb,[shade(P[1],.05),shade(P[1],-.18)]),lw);
  if(k==='temple'){rr(c,u*.15,y0+u*.42,fw-u*.3,fh-u*.6,u*.04);fs(c,'#c8372d',lw*.7);c.strokeStyle='#ffd35a';c.lineWidth=u*.04;rr(c,u*.25,y0+u*.5,fw-u*.5,fh-u*.78,u*.04);c.stroke();
   for(let i=0;i<5;i++){circ(c,u*.6+i*(fw-u*1.2)/4,y0+u*.78,u*.08);c.fillStyle='#ffd35a';c.fill()}}
  else{const n=f.w;for(let i=0;i<n;i++){rr(c,i*u+u*.1,y0+u*.46,u*.8,fh-u*.66,u*.05);c.fillStyle=shade(P[1],-.08);c.fill();c.strokeStyle='rgba(0,0,0,.15)';c.lineWidth=1;c.stroke();c.fillStyle='rgba(255,255,255,.12)';c.fillRect(i*u+u*.14,y0+u*.5,u*.06,fh-u*.74)}
   if(k==='store'){c.fillStyle=P[2];c.fillRect(lw/2,y0+u*.36,fw-lw,u*.1)}}
  c.fillStyle='rgba(0,0,0,.25)';c.fillRect(lw/2,yb-u*.12,fw-lw,u*.1);
  rr(c,-u*.04,y0-u*.06,fw+u*.08,u*.48,u*.08);fs(c,lg(c,0,y0-u*.06,0,y0+u*.42,[shade(P[0],.18),P[0]]),lw);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(u*.1,y0,fw-u*.2,u*.05);
  const ty=y0+u*.12;
  if(k==='inn'){ell(c,fw*.8,ty+u*.1,u*.16,u*.06);fs(c,'#8a6a2a',lw*.7);c.beginPath();c.arc(fw*.8,ty+u*.08,u*.13,Math.PI,0);fs(c,lg(c,0,ty-u*.06,0,ty+u*.1,['#ffe7a0','#d9a52a']),lw*.8);circ(c,fw*.8,ty-u*.07,u*.03);fs(c,'#8a6a2a',lw*.5);
   c.save();c.translate(fw*.35,ty+u*.08);c.rotate(-.08);rr(c,-u*.32,-u*.12,u*.32,u*.24,u*.02);fs(c,'#fffaf0',lw*.6);rr(c,0,-u*.12,u*.32,u*.24,u*.02);fs(c,'#fffaf0',lw*.6);c.strokeStyle='#9aa4b8';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-u*.27,-u*.06+i*u*.06);c.lineTo(-u*.05,-u*.06+i*u*.06);c.moveTo(u*.05,-u*.06+i*u*.06);c.lineTo(u*.27,-u*.06+i*u*.06);c.stroke()}c.restore();
   rr(c,fw*.1,ty-u*.2,u*.16,u*.28,u*.05);fs(c,'#7fb8e6',lw*.6);circ(c,fw*.1+u*.08,ty-u*.28,u*.09);fs(c,'#ff8fb6',lw*.5)}
  if(k==='store'){rr(c,fw*.62,ty-u*.32,u*.62,u*.42,u*.06);fs(c,lg(c,0,ty-u*.32,0,ty+u*.1,['#5b6178','#3d4766']),lw);rr(c,fw*.62+u*.08,ty-u*.27,u*.46,u*.14,u*.03);fs(c,'#9fe8d8',lw*.5);
   for(let r=0;r<2;r++)for(let i=0;i<3;i++){rr(c,fw*.62+u*(.1+i*.15),ty-u*.08+r*u*.08,u*.11,u*.05,u*.01);c.fillStyle='#dfe5f2';c.fill()}
   rr(c,fw*.15,ty-u*.15,u*.7,u*.22,u*.04);fs(c,'#ffffff',lw*.7);for(let i=0;i<6;i++){circ(c,fw*.15+u*(.1+i*.1),ty-u*.04,u*.04);c.fillStyle=['#ff5b4a','#ffc93c','#14b3a4'][i%3];c.fill()}}
  if(k==='tea'){rr(c,fw*.7,ty-u*.42,u*.5,u*.5,u*.06);fs(c,lg(c,0,ty-u*.42,0,ty+u*.1,['#f4f6fb','#b9c1d6']),lw);rr(c,fw*.7+u*.12,ty-u*.2,u*.26,u*.22,u*.03);fs(c,'#2a2d38',lw*.6);c.strokeStyle=OUT;c.lineWidth=lw;c.beginPath();c.moveTo(fw*.7+u*.45,ty-u*.35);c.lineTo(fw*.7+u*.62,ty-u*.5);c.stroke();
   ['#c88a4a','#e8cfa8','#8fc06a','#e8cfa8'].forEach((col,i)=>{const x=fw*.12+i*u*.38;rr(c,x,ty-u*.32,u*.24,u*.4,u*.05);fs(c,'rgba(255,255,255,.85)',lw*.6);rr(c,x+u*.03,ty-u*.2,u*.18,u*.26,u*.03);c.fillStyle=col;c.fill();for(let p=0;p<3;p++){circ(c,x+u*(.07+p*.05),ty+u*.0,u*.022);c.fillStyle='#2a1a12';c.fill()}c.strokeStyle='#ff5b4a';c.lineWidth=u*.03;c.beginPath();c.moveTo(x+u*.14,ty-u*.32);c.lineTo(x+u*.18,ty-u*.46);c.stroke()})}
  if(k==='temple'){[.25,.75].forEach(p=>{rr(c,fw*p-u*.05,ty-u*.3,u*.1,u*.34,u*.02);fs(c,'#ff4a3a',lw*.6);ell(c,fw*p,ty-u*.36,u*.04,u*.07);c.fillStyle='#ffc93c';c.fill()});
   ell(c,fw*.5,ty+u*.05,u*.3,u*.08);fs(c,'#e9e2d0',lw*.7);[[-.12,-.02],[.1,-.02],[0,-.1],[-.04,.0],[.04,.0]].forEach(([dx,dy])=>{circ(c,fw*.5+dx*u,ty+dy*u,u*.08);fs(c,'#ff9f2e',lw*.5)})}}
 else if(f.t==='shelf'){shadow(0,fw);rr(c,0,y0-u*.2,fw,fh+u*.15,u*.05);fs(c,'#b8c0d0',lw);rr(c,u*.06,y0-u*.14,fw-u*.12,fh,u*.03);c.fillStyle='#eef1f6';c.fill();
  rr(c,0,y0-u*.32,fw,u*.16,u*.04);fs(c,'#d7dde8',lw*.8);
  const rows=3,rh=(fh+u*.2)/rows;const R=rng(f.x*13+f.y*7);
  for(let r=0;r<rows;r++){const sy=y0-u*.12+r*rh;let x=u*.1;while(x<fw-u*.2){const kind=R(),col=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6','#8fd36b','#fff'][Math.floor(R()*7)];
    if(kind<.35){const bw=u*.13,bh=rh*.7;rr(c,x,sy+rh-bh-u*.06,bw,bh,u*.04);fs(c,col,lw*.4);rr(c,x+bw*.25,sy+rh-bh-u*.1,bw*.5,u*.06,u*.01);c.fillStyle='#3d4766';c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x+bw*.2,sy+rh-bh,bw*.2,bh*.5);x+=bw+u*.03}
    else if(kind<.7){const bw=u*.22,bh=rh*.6;rr(c,x,sy+rh-bh-u*.06,bw,bh,u*.02);fs(c,col,lw*.4);c.fillStyle='rgba(255,255,255,.8)';c.fillRect(x+u*.03,sy+rh-bh*.6-u*.06,bw-u*.06,bh*.25);x+=bw+u*.03}
    else{const bw=u*.15,bh=rh*.45;rr(c,x,sy+rh-bh-u*.06,bw,bh,u*.03);fs(c,lg(c,x,0,x+bw,0,[shade(col,.3),col,shade(col,-.2)]),lw*.4);x+=bw+u*.03}}
   c.fillStyle='#9aa4b8';c.fillRect(u*.06,sy+rh-u*.06,fw-u*.12,u*.06);for(let t=0;t<3;t++){c.fillStyle='#ffd35a';c.fillRect(u*.2+t*fw/3,sy+rh-u*.05,u*.16,u*.06)}}}
 else if(f.t==='sofa'){shadow(0,fw);const col='#3a7bd5';rr(c,u*.05,y0-u*.05,fw-u*.1,u*.6,u*.18);fs(c,lg(c,0,y0,0,y0+u*.6,[shade(col,.15),shade(col,-.12)]),lw);
  rr(c,u*.02,y0+u*.35,u*.28,fh-u*.3,u*.12);fs(c,shade(col,-.08),lw);rr(c,fw-u*.3,y0+u*.35,u*.28,fh-u*.3,u*.12);fs(c,shade(col,-.08),lw);
  for(let i=0;i<2;i++){rr(c,u*.3+i*(fw-u*.6)/2,y0+u*.45,(fw-u*.6)/2,fh-u*.5,u*.1);fs(c,lg(c,0,y0+u*.45,0,yb,[shade(col,.3),col]),lw*.8)}
  [[.5,'#ffc93c'],[fw/u-.6,'#ff8fb6']].forEach(([px,pc])=>{c.save();c.translate(px*u,y0+u*.32);c.rotate(px<1?-.25:.25);rr(c,-u*.18,-u*.16,u*.36,u*.32,u*.1);fs(c,pc,lw*.7);c.restore()});
  c.fillStyle='#4a3020';c.fillRect(u*.15,yb-u*.1,u*.08,u*.08);c.fillRect(fw-u*.23,yb-u*.1,u*.08,u*.08)}
 else if(f.t==='plant'){shadow(u*.15,u*.7);const px=u*.5,pt=yb-u*.48;c.beginPath();c.moveTo(px-u*.25,pt);c.lineTo(px+u*.25,pt);c.lineTo(px+u*.19,yb-u*.08);c.lineTo(px-u*.19,yb-u*.08);c.closePath();fs(c,lg(c,px-u*.25,0,px+u*.25,0,['#ffffff','#d6d0c4']),lw);
  rr(c,px-u*.29,pt-u*.06,u*.58,u*.1,u*.04);fs(c,'#f4f0e8',lw*.8);ell(c,px,pt-u*.01,u*.22,u*.05);c.fillStyle='#5a3a22';c.fill();
  const leaves=[[-.9,.9],[-.45,1.05],[0,1.15],[.45,1.05],[.9,.9],[-.2,.8],[.25,.85]];leaves.forEach(([a2,len],i)=>{c.save();c.translate(px,pt);c.rotate(a2*.7);const L=len*u*.62;
   c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-u*.2,-L*.55,0,-L);c.quadraticCurveTo(u*.2,-L*.55,0,0);fs(c,lg(c,-u*.2,0,u*.2,0,[i%2?'#3f9a4a':'#4fb456','#2f7a3a']),lw*.7);
   c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=u*.02;c.beginPath();c.moveTo(0,-u*.05);c.lineTo(0,-L*.9);c.stroke();c.restore()})}
 else if(f.t==='table'){shadow(0,fw);[-1,1].forEach(s2=>{const cx2=fw/2+s2*u*.42;rr(c,cx2-u*.12,y0+u*.05,u*.24,u*.45,u*.06);fs(c,'#a8743f',lw*.8);ell(c,cx2,y0+u*.52,u*.17,u*.08);fs(c,'#c99060',lw*.8);c.fillStyle='#6b4226';c.fillRect(cx2-u*.1,y0+u*.58,u*.04,u*.3);c.fillRect(cx2+u*.06,y0+u*.58,u*.04,u*.3)});
  rr(c,fw/2-u*.05,y0+u*.45,u*.1,u*.42,u*.03);fs(c,'#6b4226',lw*.8);ell(c,fw/2,yb-u*.1,u*.2,u*.05);fs(c,'#6b4226',lw*.8);
  ell(c,fw/2,y0+u*.42,u*.36,u*.12);fs(c,'#8a5a36',lw);ell(c,fw/2,y0+u*.38,u*.36,u*.12);fs(c,lg(c,0,y0+u*.26,0,y0+u*.5,['#f3d9b0','#d9b07a']),lw);
  rr(c,fw/2-u*.06,y0+u*.08,u*.13,u*.26,u*.03);fs(c,'rgba(255,255,255,.85)',lw*.5);rr(c,fw/2-u*.045,y0+u*.16,u*.1,u*.16,u*.02);c.fillStyle='#d9a066';c.fill();c.strokeStyle='#ff5b4a';c.lineWidth=u*.025;c.beginPath();c.moveTo(fw/2,y0+u*.08);c.lineTo(fw/2+u*.04,y0-u*.03);c.stroke()}
 else if(f.t==='burner'){shadow(u*.1,u*.8);const cx2=fw/2,by2=yb-u*.12;[-.25,0,.25].forEach(d=>{rr(c,cx2+d*u-u*.04,by2-u*.18,u*.08,u*.2,u*.03);fs(c,'#6b4a1a',lw*.6)});
  ell(c,cx2,by2-u*.35,u*.38,u*.26);fs(c,lg(c,cx2-u*.38,0,cx2+u*.38,0,['#d9b04a','#a37a24','#6b4a1a']),lw);
  [-1,1].forEach(s2=>{c.beginPath();c.arc(cx2+s2*u*.42,by2-u*.45,u*.09,0,Math.PI*2);c.strokeStyle=OUT;c.lineWidth=lw*1.8;c.stroke();c.strokeStyle='#c99a3a';c.lineWidth=lw;c.stroke()});
  ell(c,cx2,by2-u*.58,u*.36,u*.08);fs(c,'#e0b84a',lw);c.fillStyle='#ffd35a';for(let i=0;i<6;i++){circ(c,cx2-u*.25+i*u*.1,by2-u*.32,u*.025);c.fill()}
  for(let i=0;i<5;i++){const x=cx2-u*.14+i*u*.07;c.strokeStyle='#8a5a36';c.lineWidth=u*.02;c.beginPath();c.moveTo(x,by2-u*.58);c.lineTo(x+(i-2)*u*.02,by2-u*.86);c.stroke();circ(c,x+(i-2)*u*.02,by2-u*.87,u*.018);c.fillStyle='#ff4a3a';c.fill()}
  c.strokeStyle='rgba(220,220,230,.75)';c.lineWidth=u*.05;c.lineCap='round';[-.06,.06].forEach(d=>{c.beginPath();c.moveTo(cx2+d*u,by2-u*.9);c.bezierCurveTo(cx2+d*u+u*.18,by2-u*1.0,cx2+d*u-u*.15,by2-u*1.1,cx2+d*u+u*.05,by2-u*1.25);c.stroke()})}
 else if(f.t==='pillar'){shadow(u*.1,u*.8);const tem=k==='temple';rr(c,u*.12,yb-u*.3,u*.76,u*.26,u*.04);fs(c,tem?'#8f8a80':'#d6dbe6',lw);
  rr(c,u*.24,y0-u*.6,u*.52,yb-u*.3-(y0-u*.6),u*.06);fs(c,lg(c,u*.24,0,u*.76,0,tem?['#e8524a','#c8372d','#8a1f18']:['#ffffff','#e6eaf2','#b9c1d6']),lw);
  if(tem){c.fillStyle='#ffd35a';[.25,.55].forEach(p=>{const yy=y0-u*.6+(yb-y0)*p;c.fillRect(u*.26,yy,u*.48,u*.06)});c.strokeStyle='#ffd35a';c.lineWidth=u*.03;c.beginPath();for(let t=0;t<=1;t+=.05){const yy=y0-u*.3+t*u*1.1,xx=u*.5+Math.sin(t*14)*u*.18;t?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke()}
  else{c.strokeStyle='rgba(120,130,160,.25)';c.lineWidth=1;[.38,.5,.62].forEach(p=>{c.beginPath();c.moveTo(p*u,y0-u*.5);c.lineTo(p*u,yb-u*.32);c.stroke()});c.fillStyle=city.roof;c.fillRect(u*.26,yb-u*.55,u*.48,u*.1)}
  rr(c,u*.14,y0-u*.72,u*.72,u*.16,u*.04);fs(c,tem?'#2f9a6a':'#eef1f6',lw)}
 else if(f.t==='dispenser'){shadow(u*.15,u*.7);rr(c,u*.22,y0+u*.1,u*.56,fh-u*.15,u*.08);fs(c,lg(c,u*.22,0,u*.78,0,['#ffffff','#d6dbe6']),lw);
  rr(c,u*.28,y0-u*.6,u*.44,u*.72,u*.18);fs(c,'rgba(120,190,240,.75)',lw);c.fillStyle='rgba(255,255,255,.6)';c.fillRect(u*.34,y0-u*.48,u*.06,u*.45);
  [['#ff5b4a',.38],['#3a7bd5',.62]].forEach(([col,p])=>{rr(c,p*u-u*.05,y0+u*.32,u*.1,u*.08,u*.02);fs(c,col,lw*.6)});rr(c,u*.3,y0+u*.52,u*.4,u*.05,u*.02);fs(c,'#9aa4b8',lw*.5)}
 else if(f.t==='rack'){shadow(u*.1,u*.8);rr(c,u*.12,y0-u*.2,u*.76,fh+u*.1,u*.05);fs(c,'#8a5a36',lw);for(let r=0;r<3;r++)for(let i=0;i<3;i++){rr(c,u*(.18+i*.22),y0-u*.12+r*u*.36,u*.18,u*.3,u*.02);fs(c,['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'][(r*3+i)%5],lw*.4);c.fillStyle='rgba(255,255,255,.75)';c.fillRect(u*(.2+i*.22),y0-u*.08+r*u*.36,u*.14,u*.05)}}
 else if(f.t==='cushion'){ell(c,fw/2,yb-u*.45,u*.36,u*.24);fs(c,lg(c,0,yb-u*.7,0,yb-u*.2,['#ff6b5a','#b8312a']),lw);ell(c,fw/2,yb-u*.47,u*.25,u*.15);c.strokeStyle='#ffd35a';c.lineWidth=u*.03;c.stroke()}
 return cv}

// ==================== game.js ====================
// ===== 遊戲引擎 =====
const $=s=>document.querySelector(s);
const KEY='formosa-quest-v2';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let S=null;

/* ---------- 拼音／注音 ---------- */
const PY={};PY_RAW.split('|').forEach(g=>{const[syl,chars]=g.trim().split(' ');[...chars].forEach(c=>{if(!PY[c])PY[c]=syl})});
const MARKS={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'};
function parseSyl(syl){const m=syl.match(/^([a-zü]+)([1-5])$/);return m?[m[1].replace(/v/g,'ü'),+m[2]]:null}
function toMark(syl){const p=parseSyl(syl);if(!p)return syl;const[s,t]=p;if(t===5)return s;let i;
 if(s.includes('a'))i=s.indexOf('a');else if(s.includes('e'))i=s.indexOf('e');else if(s.includes('ou'))i=s.indexOf('o');else{for(let k=s.length-1;k>=0;k--)if('iouü'.includes(s[k])){i=k;break}}
 return s.slice(0,i)+MARKS[s[i]][t-1]+s.slice(i+1)}
const ZI={b:'ㄅ',p:'ㄆ',m:'ㄇ',f:'ㄈ',d:'ㄉ',t:'ㄊ',n:'ㄋ',l:'ㄌ',g:'ㄍ',k:'ㄎ',h:'ㄏ',j:'ㄐ',q:'ㄑ',x:'ㄒ',zh:'ㄓ',ch:'ㄔ',sh:'ㄕ',r:'ㄖ',z:'ㄗ',c:'ㄘ',s:'ㄙ'};
const ZF={a:'ㄚ',o:'ㄛ',e:'ㄜ',ai:'ㄞ',ei:'ㄟ',ao:'ㄠ',ou:'ㄡ',an:'ㄢ',en:'ㄣ',ang:'ㄤ',eng:'ㄥ',er:'ㄦ',ong:'ㄨㄥ',i:'ㄧ',ia:'ㄧㄚ',ie:'ㄧㄝ',iao:'ㄧㄠ',iu:'ㄧㄡ',iou:'ㄧㄡ',ian:'ㄧㄢ',in:'ㄧㄣ',iang:'ㄧㄤ',ing:'ㄧㄥ',iong:'ㄩㄥ',u:'ㄨ',ua:'ㄨㄚ',uo:'ㄨㄛ',uai:'ㄨㄞ',ui:'ㄨㄟ',uei:'ㄨㄟ',uan:'ㄨㄢ',un:'ㄨㄣ',uen:'ㄨㄣ',uang:'ㄨㄤ',ueng:'ㄨㄥ','ü':'ㄩ','üe':'ㄩㄝ','üan':'ㄩㄢ','ün':'ㄩㄣ'};
function toZhu(syl){const p=parseSyl(syl);if(!p)return syl;const[s,t]=p;let ini='',fin=s;
 if(s[0]==='y')fin=s.startsWith('yu')?'ü'+s.slice(2):s.startsWith('yi')?'i'+s.slice(2):'i'+s.slice(1);
 else if(s[0]==='w')fin=s.startsWith('wu')?'u'+s.slice(2):'u'+s.slice(1);
 else if(['zh','ch','sh'].includes(s.slice(0,2))){ini=s.slice(0,2);fin=s.slice(2)}
 else if(ZI[s[0]]&&s!=='er'){ini=s[0];fin=s.slice(1)}
 if(ini&&'jqx'.includes(ini)&&fin[0]==='u')fin='ü'+fin.slice(1);
 const fz=(fin==='i'&&['zh','ch','sh','r','z','c','s'].includes(ini))?'':(ZF[fin]??fin);const core=(ini?ZI[ini]:'')+fz;
 return t===5?'˙'+core:core+['','ˊ','ˇ','ˋ'][t-1]}
function segment(text){const out=[],ch=[...text];let i=0;
 while(i<ch.length){let hit=null;for(let L=Math.min(4,ch.length-i);L>=2;L--){const w=ch.slice(i,i+L).join('');if(PY_WORDS[w]){hit=[w,PY_WORDS[w].split(' ')];break}}
  if(hit){[...hit[0]].forEach((c,k)=>out.push([c,hit[1][k]]));i+=[...hit[0]].length;continue}out.push([ch[i],PY[ch[i]]||null]);i++}return out}
function rb(text){const mode=S?S.settings.ruby:'pinyin';if(mode==='off')return esc(text);
 return segment(String(text)).map(([c,s])=>s?`<ruby>${esc(c)}<rt>${mode==='zhuyin'?toZhu(s):toMark(s)}</rt></ruby>`:esc(c)).join('')}

/* ---------- 多語 ---------- */
const LI=()=>S&&S.settings.lang==='ja'?2:1;
const tr=a=>a[LI()];                                    // [zh,en,ja] → 說明語言
const T=k=>esc(UI[k][LI()]);
const Z=k=>rb(UI[k][0]);
const ZT=(k,cls='')=>`<span class="zh">${Z(k)}</span><span class="tl ${cls}">${T(k)}</span>`;
const cityName=(c)=>`${rb(c.zh)}<span class="tl">${esc(LI()===2?c.ja:c.en)}</span>`;
const itemTr=it=>LI()===2?it.ja:it.en;

/* ---------- 語音：只用臺灣口音 ---------- */
let twVoices=[];
const isTW=v=>{const l=(v.lang||'').toLowerCase().replace('_','-');return l==='zh-tw'||l.startsWith('zh-tw')||l.startsWith('cmn-hant-tw')||/taiwan|台灣|臺灣/i.test(v.name)};
function loadVoices(){try{twVoices=speechSynthesis.getVoices().filter(isTW)}catch(e){twVoices=[]}}
if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
const ttsOK=()=>twVoices.length>0;
function speak(text,rate){if(!ttsOK())return false;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);
 u.voice=twVoices.find(v=>v.voiceURI===S.settings.voice)||twVoices[0];u.lang=u.voice.lang||'zh-TW';u.rate=rate||S.settings.rate;speechSynthesis.speak(u);return true}catch(e){return false}}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};

/* ---------- 內容 ---------- */
function norm(a,lv){const t=a[0];
 if(t==='v')return{t,w:a[1],en:a[2],ja:a[3],lv:lv??a[4]};
 if(t==='g')return{t,s:a[1],a:a[2],d:a[3].split('|'),en:a[4],ja:a[5],lv:lv??a[6]};
 return{t,s:a[1],en:a[2],ja:a[3],lv:lv??a[4]}}
const POOLS=CITIES.map(c=>c.pool.map(x=>norm(x)));
const cityLv=ci=>1+ci*3;
const ALLV=POOLS.flat().filter(i=>i.t==='v').concat(ANIMALS.flatMap(a=>a.items.filter(i=>i[0]==='v').map(i=>norm(i,30))),LEAGUE[5].pool.filter(i=>i[0]==='v').map(i=>norm(i)));
const ALLL=POOLS.flat().filter(i=>i.t==='l').concat(ANIMALS.flatMap(a=>a.items.filter(i=>i[0]==='l').map(i=>norm(i,30))));

/* ---------- 狀態 ---------- */
function fresh(name){const ja=(navigator.language||'').toLowerCase().startsWith('ja');
 return{v:2,name,gender:'m',lv:1,xp:0,fat:45,money:300,bag:{snack:1,drink:1,bubble:0},badges:0,city:0,x:11,y:2,dir:'down',pets:[],seen:{},beaten:{},league:0,champion:false,luck:0,
  settings:{ruby:'pinyin',lang:ja?'ja':'en',rate:.9,voice:''}}}
function save(){try{const o=Object.assign({},S);if(MAP&&MAP.kind==='in'&&MAP.ret){o.x=MAP.ret.x;o.y=MAP.ret.y}localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):null}catch(e){return null}}
const has=id=>(S.pets||[]).some(p=>p.sp===id);
const petLv=id=>Math.max(0,...(S.pets||[]).filter(p=>p.sp===id).map(p=>p.lv));
const petNeed=lv=>10+lv*6;
const petName=p=>p.nick||ANIMALS.find(a=>a.id===p.sp).zh;
function migrate(){if(!S.pets){S.pets=(S.comps||[]).map(sp=>({sp,nick:'',lv:1,xp:0}))}delete S.comps}
const maxFat=()=>40+S.lv*5+(has('leopard')?15+3*(petLv('leopard')-1):0);
const xpNeed=L=>Math.round(15*Math.pow(L,1.3));
const innFee=()=>20+S.lv*10;

/* ---------- 地圖 ---------- */
const W=24,H=34;
let MAP=null;  // {g:ground, objs, blocked, doors, trainers, inn:{x,y}}
function genMap(ci){const r=rng(ci*7919+13),city=CITIES[ci];const g=Array.from({length:H},()=>Array(W).fill(GT.G));const objs=[],doors={};
 const blocked=Array.from({length:H},()=>Array(W).fill(false));
 const block=(x,y)=>{if(blocked[y])blocked[y][x]=true};
 for(let x=1;x<=22;x++){g[7][x]=GT.PB;g[8][x]=GT.PB;g[13][x]=GT.PB;g[14][x]=GT.PB}
 for(let y=0;y<H;y++){g[y][11]=y<16?GT.PB:GT.PD;g[y][12]=y<16?GT.PB:GT.PD}
 const bl=[['gym',2,2],['inn',14,2],['store',1,9],['tea',6,10],['temple',13,9],['house',20,9]];
 bl.forEach(([kind,bx,by])=>{const b=BLD[kind];const o={type:'bld',kind,x:bx,y:by,w:b.w,h:b.h};objs.push(o);
  for(let y=by;y<by+b.h;y++)for(let x=bx;x<bx+b.w;x++)block(x,y);const dx=bx+Math.floor(b.w/2),dy=by+b.h-1;blocked[dy][dx]=false;doors[dx+','+dy]=kind;o.door=[dx,dy]});
 g[7][9]=GT.PB;
 [[10,6],[13,6],[10,12],[19,15],[4,15]].forEach(([x,y])=>{objs.push({type:'lamp',x,y});block(x,y)});
 objs.push({type:'sign',x:9,y:6,what:'gym'});block(9,6);
 objs.push({type:'arch',x:10,y:1});block(10,1);block(13,1);
 // 邊界樹
 for(let y=0;y<H;y++){[0,23].forEach(x=>{objs.push({type:'tree',x,y,kind:city.tree});block(x,y)})}
 for(let x=1;x<23;x++){if(x===11||x===12)continue;if(!blocked[0][x]){objs.push({type:'tree',x,y:0,kind:city.tree});block(x,0)}objs.push({type:'tree',x,y:H-1,kind:city.tree});block(x,H-1)}
 // 鎮上的空地放花
 for(let i=0;i<14;i++){const x=1+Math.floor(r()*22),y=15+Math.floor(r()*2);if(g[y][x]===GT.G&&!blocked[y][x])g[y][x]=GT.FL}
 // 路線：高草叢
 const patches=[[2,18],[14,18],[3,23],[15,23],[2,28],[14,28],[7,31]];
 patches.forEach(([px,py])=>{const w=3+Math.floor(r()*4),h=2+Math.floor(r()*2);for(let y=py;y<Math.min(H-1,py+h);y++)for(let x=px;x<Math.min(px+w,23);x++)if(x!==11&&x!==12&&!blocked[y][x])g[y][x]=GT.TG});
 // 池塘
 const pond=r()<.5?[18,20]:[3,20];if(r()<.75)for(let y=pond[1];y<pond[1]+2;y++)for(let x=pond[0];x<pond[0]+3;x++){if(x>0&&x<23){g[y][x]=GT.WA;block(x,y)}}
 // 樹
 for(let i=0;i<16;i++){const x=1+Math.floor(r()*22),y=17+Math.floor(r()*15);if(x>=9&&x<=14)continue;if(g[y][x]===GT.G&&!blocked[y][x]){objs.push({type:'tree',x,y,kind:r()<.25?'broad':city.tree});block(x,y)}}
 for(let i=0;i<10;i++){const x=1+Math.floor(r()*22),y=17+Math.floor(r()*15);if(g[y][x]===GT.G&&!blocked[y][x])g[y][x]=GT.FL}
 // 訓練家
 const spots=shuffle([[10,19,'right'],[13,22,'left'],[10,26,'right'],[13,29,'left'],[8,16,'right'],[15,16,'left'],[10,31,'right']]);
 const trainers=[];const nT=3+(ci>8?1:0);
 for(let k=0;k<nT;k++){const[x,y,dir]=spots[k];g[y][x]=GT.G;blocked[y][x]=false;const cls=Math.floor(r()*TRAINERS.length);
  trainers.push({id:ci+'-'+k,x,y,dir,home:dir,cls,lv:cityLv(ci)+1+k,turnT:1500+r()*2500})}
 const innO=objs.find(o=>o.kind==='inn');
 const town={kind:'town',w:W,h:H,ci,g,objs,blocked,doors,trainers,npcs:[],inn:{x:innO.door[0],y:innO.door[1]+1}};TOWN=town;return town}
let TOWN=null;
const isWalk=(x,y)=>x>=0&&y>=0&&x<MAP.w&&y<MAP.h&&!MAP.blocked[y][x]&&!MAP.trainers.some(t=>t.x===x&&t.y===y)&&!(MAP.npcs||[]).some(n=>n.x===x&&n.y===y)&&!(MAP.walkers||[]).some(n=>n.x===x&&n.y===y||(n.mv&&n.mv.tx===x&&n.mv.ty===y));

/* ---------- 畫面與快取 ---------- */
const cv=$('#map'),ctx=cv.getContext('2d');
let U=48,DPR=1,VW=0,VH=0,ground=null,sprites={},emblems=[];
function fit(){DPR=Math.min(2,window.devicePixelRatio||1);VW=cv.clientWidth;VH=cv.clientHeight;cv.width=Math.round(VW*DPR);cv.height=Math.round(VH*DPR);
 let u=MAP&&MAP.kind==='in'?clamp(Math.floor(Math.min(VW/8.5,VH/9.5)),40,72):clamp(Math.floor(Math.min(VW/12,VH/9)),34,64);if(u!==U||!ground){U=u;rebuild()}}
function rebuild(){if(!MAP)return;const gd=Math.min(DPR,Math.sqrt(8e6/(MAP.w*U*MAP.h*U)));ground=MAP.kind==='in'?paintInterior(MAP,U,gd,CITIES[MAP.ci],emblem(MAP.ci)):paintGround(MAP.g,MAP.ci,U,gd);ground._d=gd;sprites={}}
function spr(key,make){return sprites[key]||(sprites[key]=make())}
function emblem(ci){if(!emblems[ci]){const img=emblemImage(ci);img.onload=()=>{if(MAP&&MAP.ci===ci){delete sprites['bld-gym'];if(MAP.kind==='in')rebuild()}};emblems[ci]=img}return emblems[ci]}

/* ---------- 遊戲迴圈 ---------- */
let mode='title',mv=null,held=null,last=performance.now(),tick=0,cut=null,bubble=null;
function camera(){let px=S.x*U,py=S.y*U;if(mv){px=(mv.fx+(mv.tx-mv.fx)*mv.t)*U;py=(mv.fy+(mv.ty-mv.fy)*mv.t)*U}
 let cx=px+U/2-VW/2,cy=py+U/2-VH/2;const mw=MAP.w*U,mh=MAP.h*U;cx=mw<VW?(mw-VW)/2:clamp(cx,0,mw-VW);cy=mh<VH?(mh-VH)/2:clamp(cy,0,mh-VH);return[Math.round(cx),Math.round(cy),px,py]}
const PLAYER={hair:'#3a2618',top:'#14b3a4',trim:'#ffffff',bottom:'#2b3a66',shoes:'#ff5b4a',style:'cap',cap:'#ff5b4a',pack:'#ffc93c'};
function playerLook(){return S&&S.gender==='f'?PLAYER_F:PLAYER}
const PLAYER_F={hair:'#4a2a1a',top:'#ff7a6b',trim:'#ffffff',bottom:'#2b3a66',shoes:'#ffffff',style:'long',ribbon:'#ffc93c',pack:'#14b3a4',skirt:'#2b3a66'};
const tdata=t=>t.guard?GUARD:TRAINERS[t.cls];
function trainerLook(t){if(t.look)return t.look;const d=TRAINERS[t.cls];return{hair:d.hair,top:d.top,bottom:'#3d4766',style:d.style,cap:'#3a7bd5'}}
function render(){tick++;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=MAP&&MAP.kind==='in'?'#1b2340':'#2f7a3a';ctx.fillRect(0,0,VW,VH);if(!MAP||!ground)return;
 const[cx,cy,ppx,ppy]=camera();
 {const gd=ground._d,sx=Math.max(0,cx),sy=Math.max(0,cy),sw=Math.min(MAP.w*U,cx+VW)-sx,sh=Math.min(MAP.h*U,cy+VH)-sy;if(sw>0&&sh>0)ctx.drawImage(ground,sx*gd,sy*gd,sw*gd,sh*gd,sx-cx,sy-cy,sw,sh)}
 // 水面閃光
 const x0=Math.max(0,Math.floor(cx/U)),y0=Math.max(0,Math.floor(cy/U)),x1=Math.min(MAP.w-1,Math.ceil((cx+VW)/U)),y1=Math.min(MAP.h-1,Math.ceil((cy+VH)/U));
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(MAP.g[y][x]===GT.WA){const ph=(tick/30+x*.7+y*1.3)%(Math.PI*2);ctx.strokeStyle=`rgba(255,255,255,${.25+.25*Math.sin(ph)})`;ctx.lineWidth=U*.04;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x*U-cx+U*.25+Math.sin(ph)*U*.08,y*U-cy+U*.45);ctx.lineTo(x*U-cx+U*.55+Math.sin(ph)*U*.08,y*U-cy+U*.45);ctx.stroke()}
 const list=[];
 MAP.objs.forEach(o=>{let bx=o.x*U-cx,by=(o.y+1)*U-cy;
  if(o.type==='tree'){if(bx<-2*U||bx>VW+U||by<-U||by>VH+3*U)return;list.push([by,()=>{const s=spr('tree-'+o.kind,()=>spriteTree(o.kind,U,DPR));ctx.drawImage(s,bx+U/2-U,by-2.42*U,2*U,2.5*U)}])}
  else if(o.type==='bld'){const b=BLD[o.kind];by=(o.y+b.h)*U-cy;list.push([by,()=>{const s=spr('bld-'+o.kind,()=>spriteBuilding(o.kind,U,DPR,CITIES[MAP.ci],emblem(MAP.ci)));ctx.drawImage(s,bx,by-(b.h+b.ex)*U,b.w*U,(b.h+b.ex)*U)}])}
  else if(o.type==='lamp')list.push([by,()=>{ctx.drawImage(spr('lamp',()=>spriteLamp(U,DPR)),bx,by-2*U,U,2*U)}]);
  else if(o.type==='sign')list.push([by,()=>{ctx.drawImage(spr('sign-'+o.what,()=>spriteSign(U,DPR,o.what==='gym'?CITIES[MAP.ci].roof:'#14b3a4')),bx,by-1.12*U,U,1.2*U)}]);
  else if(o.type==='arch')list.push([by+U*.1,()=>{ctx.drawImage(spr('arch',()=>spriteArch(U,DPR,CITIES[MAP.ci])),bx,by-2.6*U,4*U,2.6*U)}])});
 MAP.trainers.forEach(t=>{let tx=t.x,ty=t.y;if(t.mv){tx=t.mv.fx+(t.mv.tx-t.mv.fx)*t.mv.t;ty=t.mv.fy+(t.mv.ty-t.mv.fy)*t.mv.t}
  const bx=tx*U-cx+U/2,by=(ty+1)*U-cy;list.push([by,()=>{drawChar(ctx,bx,by-U*.06,U*1.05,trainerLook(t),t.dir,t.mv&&t.mv.t>.25&&t.mv.t<.75?1:0);
   if(MAP.g[Math.round(ty)][Math.round(tx)]===GT.TG)grassFront(Math.round(tx)*U-cx,Math.round(ty)*U-cy);
   if(bubble&&bubble.t===t){ctx.save();const bx2=bx,by2=by-U*1.55;rr(ctx,bx2-U*.2,by2-U*.42,U*.4,U*.44,U*.12);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle='#ff5b4a';ctx.font=`900 ${U*.36}px sans-serif`;ctx.textAlign='center';ctx.fillText('!',bx2,by2-U*.08);ctx.restore()}}])});
 if(MAP.kind==='in'){MAP.furn.forEach(f=>{if(f.t==='platform')return;const ex=FEX[f.t]||.5,bx=f.x*U-cx,by=(f.y+f.h)*U-cy;list.push([by-.5,()=>ctx.drawImage(spr('f-'+f.t+f.w+'x'+f.h+'-'+f.x+f.y,()=>spriteFurn(f,MAP.bk,U,DPR,CITIES[MAP.ci])),bx,by-(f.h+ex)*U,f.w*U,(f.h+ex)*U)])});
  (MAP.walkers||[]).forEach(n=>{let tx=n.x,ty=n.y;if(n.mv){tx=n.mv.fx+(n.mv.tx-n.mv.fx)*n.mv.t;ty=n.mv.fy+(n.mv.ty-n.mv.fy)*n.mv.t}const bx=tx*U-cx+U/2,by=(ty+1)*U-cy;list.push([by,()=>drawChar(ctx,bx,by-U*.06,U*1.05,n.look,n.dir,n.mv&&n.mv.t>.25&&n.mv.t<.75?1:0)])})}
 (MAP.npcs||[]).forEach(n=>{const bx=n.x*U-cx+U/2,by=(n.y+1)*U-cy;list.push([by,()=>drawChar(ctx,bx,by-U*.06,U*1.05,n.look,n.dir,0)])});
 const step=mv&&mv.t>.2&&mv.t<.8?(Math.floor(tick/8)%2?1:-1):0;
 list.push([ppy+U-cy+.5,()=>{drawChar(ctx,ppx-cx+U/2,ppy+U-cy-U*.06,U*1.05,playerLook(),S.dir,step);
  const tx=Math.round(ppx/U),ty=Math.round(ppy/U);if(!mv&&MAP.g[ty][tx]===GT.TG)grassFront(tx*U-cx,ty*U-cy)}]);
 list.sort((a,b)=>a[0]-b[0]).forEach(([,f])=>{try{f()}catch(e){}})}
function grassFront(x,y){const s=spr('tgf',()=>{const c=mkc(U,U,DPR);drawTallGrass(c.getContext('2d'),0,0,U,rng(3),true);return c});ctx.drawImage(s,x,y,U,U)}
function loop(now){requestAnimationFrame(loop);try{loopBody(now)}catch(e){console.error(e)}}
function loopBody(now){const dt=Math.min(50,now-last);last=now;
 if(mode==='world'&&MAP){
  if(mv){mv.t+=dt/170;if(mv.t>=1){S.x=mv.tx;S.y=mv.ty;mv=null;onStep()}}
  if(!mv&&held&&mode==='world')tryMove(held);
  (MAP.walkers||[]).forEach(n=>{if(n.mv){n.mv.t+=dt/260;if(n.mv.t>=1){n.x=n.mv.tx;n.y=n.mv.ty;n.mv=null}return}if(n.talk)return;n.wt-=dt;if(n.wt>0)return;n.wt=900+Math.random()*1800;const d=pick(['up','down','left','right']);n.dir=d;const[dx,dy]=DIRS[d],nx=n.x+dx,ny=n.y+dy;
   if(ny<4||(nx===MAP.exit.x&&ny>=MAP.h-2)||!isWalk(nx,ny)||(nx===S.x&&ny===S.y)||(mv&&mv.tx===nx&&mv.ty===ny))return;n.mv={fx:n.x,fy:n.y,tx:nx,ty:ny,t:0}});
  MAP.trainers.forEach(t=>{if(S.beaten[t.id]||cut)return;t.turnT-=dt;if(t.turnT<=0){t.turnT=1800+Math.random()*2600;t.dir=Math.random()<.5?t.home:pick(['up','down','left','right']);if(!mv)checkSight()}})}
 if(cut)cut(dt);
 render()}
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function tryMove(dir){S.dir=dir;const[dx,dy]=DIRS[dir];const nx=S.x+dx,ny=S.y+dy;
 if(ny<0||ny>=MAP.h){held=null;if(MAP.kind==='in'){if(ny>=MAP.h)leaveInterior();return}gate(ny<0?'top':'bottom');return}
 if(!isWalk(nx,ny))return;mv={fx:S.x,fy:S.y,tx:nx,ty:ny,t:0}}
let stepsSince=0;
function onStep(){stepsSince++;const k=S.x+','+S.y;
 if(MAP.kind==='in'&&S.x===MAP.exit.x&&S.y===MAP.exit.y){held=null;leaveInterior();return}
 if(MAP.doors[k]){held=null;const kind=MAP.doors[k];if(kind==='house'){S.y++;S.dir='down';dialog([UI.houseLocked]);return}enterInterior(kind,S.x,S.y);return}
 if(checkSight())return;
 if(MAP.g[S.y][S.x]===GT.TG&&stepsSince>2&&Math.random()<.13){stepsSince=0;held=null;startEncounter()}}
function sightHits(t){if(S.beaten[t.id])return false;const[dx,dy]=DIRS[t.dir];for(let k=1;k<=4;k++){const x=t.x+dx*k,y=t.y+dy*k;if(x===S.x&&y===S.y)return k;if(x<0||y<0||x>=MAP.w||y>=MAP.h||MAP.blocked[y][x])return false}return false}
function checkSight(){if(mode!=='world'||mv)return false;for(const t of MAP.trainers){const k=sightHits(t);if(k){spotted(t,k);return true}}return false}
function spotted(t,k){held=null;mode='cut';bubble={t};let phase=0,timer=0,steps=k-1;
 cut=dt=>{timer+=dt;if(phase===0&&timer>700){bubble=null;phase=1;timer=0}
  if(phase===1){if(!t.mv){if(steps<=0){cut=null;const back={up:'down',down:'up',left:'right',right:'left'};S.dir=back[t.dir];mode='world';
     const d=tdata(t);dialog([[d.hi[0],d.hi[1],d.hi[2]]],()=>trainerBattle(t),d.zh);return}
    const[dx,dy]=DIRS[t.dir];t.mv={fx:t.x,fy:t.y,tx:t.x+dx,ty:t.y+dy,t:0}}
   t.mv.t+=dt/170;if(t.mv.t>=1){t.x=t.mv.tx;t.y=t.mv.ty;t.mv=null;steps--}}}}
function interact(){if(mode!=='world'||mv)return;const[dx,dy]=DIRS[S.dir];const fx=S.x+dx,fy=S.y+dy;const c=CITIES[S.city];
 if(MAP.kind==='in'){const wk=(MAP.walkers||[]).find(n=>!n.mv&&n.x===fx&&n.y===fy);if(wk){talkWalker(wk);return}const n=MAP.npcs.find(n=>n.x===fx&&n.y===fy)||(S.dir==='up'&&MAP.furn.some(f=>f.t==='counter'&&fy===f.y&&fx>=f.x&&fx<f.x+f.w)?MAP.npcs.find(n=>n.role==='clerk'):null);if(n){talkNpc(n);return}}
 const t=MAP.trainers.find(t=>t.x===fx&&t.y===fy);
 if(t){const d=tdata(t);const back={up:'down',down:'up',left:'right',right:'left'};t.dir=back[S.dir];
  if(S.beaten[t.id])dialog([d.lose],null,d.zh);else dialog([d.hi],()=>trainerBattle(t),d.zh);return}
 const o=MAP.objs.find(o=>o.x===fx&&o.y===fy);
 if(o&&o.type==='sign'){if(o.what==='gym')dialog([[`${c.zh}語言道館・館主${c.leader}・${c.theme}`,`${c.en} Gym · Leader ${c.leader} · ${tr(c.role)}`,`${c.ja}ジム・ジムリーダー${c.leader}・${tr(c.role)}`],[`${UI.recLv[0]}：Lv ${cityLv(S.city)+2}`,`${UI.recLv[1]}: Lv ${cityLv(S.city)+2}`,`${UI.recLv[2]}：Lv ${cityLv(S.city)+2}`]],null,UI.sign[0]);
  else dialog([[`歡迎來到${c.zh}！`,`Welcome to ${c.en}!`,`${c.ja}へようこそ！`]],null,UI.sign[0]);return}
 if(MAP.g[fy]?.[fx]===GT.WA)dialog([['水很清，可以看到小魚。',"The water is clear; you can see little fish.","水が澄んでいて、小魚が見える。"]])}

/* ---------- 城市之間 ---------- */
function gate(side){const ci=S.city;
 if(side==='top'){if(ci===0){dialog([UI.airport]);return}travel(ci-1,'bottom')}
 else{if(ci===21){dialog([S.badges>=22?UI.leagueGate:UI.needBadge]);return}
  if(S.badges>ci)travel(ci+1,'top');else dialog([UI.needBadge])}}
function transitLine(from,to){const a=CITIES[from],b=CITIES[to];
 if(a.island||b.island){const byAir=(a.id==='taipei'||b.id==='taipei'||a.id==='kinmen'&&b.id==='matsu'||a.id==='matsu'&&b.id==='kinmen');
  return byAir?[`坐飛機前往${b.zh}……`,`Flying to ${b.en}…`,`飛行機で${b.ja}へ……`]:[`坐船前往${b.zh}……`,`Taking the ferry to ${b.en}…`,`フェリーで${b.ja}へ……`]}
 return null}
function travel(ci,arrive){const from=S.city;if(MAP&&MAP.kind==='in')MAP=TOWN;S.city=ci;MAP=genMap(ci);ground=null;sprites={};
 if(arrive==='top'){S.x=11;S.y=1;S.dir='down'}else if(arrive==='bottom'){S.x=11;S.y=H-2;S.dir='up'}else{S.x=MAP.inn.x;S.y=MAP.inn.y;S.dir='down'}
 mv=null;fit();rebuild();save();closePanelQuiet();showCityTag();hud();
 const t=transitLine(from,ci);if(t&&from!==ci)toast(t)}

/* ---------- 對話 ---------- */
let dq=[],dcb=null,dwho='';
function dialog(lines,cb,who){dq=lines.slice();dcb=cb||null;dwho=who||'';mode='dialog';held=null;nextLine()}
let tw=null;
function rbTw(text){const m=S?S.settings.ruby:'pinyin';return segment(String(text)).map(([c,s])=>{const r=m!=='off'&&s?`<rt>${m==='zhuyin'?toZhu(s):toMark(s)}</rt>`:'';return r?`<ruby class="twh">${esc(c)}${r}</ruby>`:`<span class="twh">${esc(c)}</span>`}).join('')}
function showLine(l,who){const box=$('#dlg');box.innerHTML=`${who?`<span class="who">${rb(who)}</span>`:''}<div class="dtext">${rbTw(l[0])}</div>${l[LI()]?`<span class="tl twh">${esc(l[LI()])}</span>`:''}<span class="more twh"></span>`;box.hidden=false;
 const els=[...box.querySelectorAll('.dtext > .twh')];let n=0;return new Promise(res=>{const fin=()=>{clearInterval(t);box.querySelectorAll('.twh').forEach(e=>e.classList.remove('twh'));tw=null;res()};
  const t=setInterval(()=>{if(n<els.length){els[n].classList.remove('twh');n++}else fin()},26);tw={fin}})}
const say=(lines,who)=>new Promise(r=>dialog(lines,r,who));
async function ask(line,who,items,opt){mode='dialog';held=null;await showLine(line,who);const i=await choice(items,opt);$('#dlg').hidden=true;mode=$('#ov').hidden?'world':'menu';return i}
let CH=null;
function choice(items,opt={}){if(CH)CH.cancel();return new Promise(res=>{const box=document.createElement('div');box.className='gb choice '+(opt.cls||'');
 box.innerHTML=(opt.title?`<div class="chtitle">${opt.title}</div>`:'')+items.map((it,i)=>`<button class="chi" data-i="${i}">${it}</button>`).join('');
 document.body.appendChild(box);const prev=mode;mode='choice';held=null;
 const close=i=>{box.remove();CH=null;mode=(prev==='choice'||prev==='dialog')?($('#ov').hidden?'world':'menu'):prev;res(i)};
 CH={box,close,cancel:()=>close(-1)};box.querySelectorAll('.chi').forEach(b=>b.onclick=()=>close(+b.dataset.i));box.querySelector('.chi').focus()})}
function qtyBox(title,price){return new Promise(res=>{const max=Math.max(0,Math.min(99,Math.floor(S.money/price)));if(!max){res(0);return}let q=1;
 const box=document.createElement('div');box.className='gb choice qty';document.body.appendChild(box);const prev=mode;mode='choice';held=null;
 const close=v=>{box.remove();CH=null;mode=prev==='choice'||prev==='dialog'?($('#ov').hidden?'world':'menu'):prev;res(v)};
 const draw=()=>{box.innerHTML=`<div class="chtitle">${title}</div><div class="qrow"><button class="qb" data-d="-1" aria-label="-1">▼</button><span class="qn">×${String(q).padStart(2,'0')}</span><button class="qb" data-d="1" aria-label="+1">▲</button></div><div class="qt">NT$${q*price}</div><div class="qbtns"><button class="chi" id="qOk">${Z('ok')}</button><button class="chi" id="qNo">${Z('cancel')}</button></div>`;
  box.querySelectorAll('.qb').forEach(b=>b.onclick=()=>adj(+b.dataset.d));box.querySelector('#qOk').onclick=()=>close(q);box.querySelector('#qNo').onclick=()=>close(0);box.querySelector('#qOk').focus()};
 const adj=d=>{q=Math.max(1,Math.min(max,q+d));if(q<1)q=max;draw()};
 CH={box,close:()=>close(q),cancel:()=>close(0),adj};draw()})}
async function healFx(){const f=document.createElement('div');f.className='heal';document.body.appendChild(f);await new Promise(r=>setTimeout(r,900));f.remove()}
function nextLine(){if(tw){tw.fin();return}const box=$('#dlg');if(!dq.length){box.hidden=true;if(mode==='dialog')mode=$('#ov').hidden?'world':'menu';const f=dcb;dcb=null;if(f)f();return}
 showLine(dq.shift(),dwho)}
$('#dlg').addEventListener('click',()=>{if(mode==='dialog')nextLine();else if(tw)tw.fin()});

/* ---------- HUD ---------- */
function hud(){if(!S)return;$('#hud').hidden=false;$('#hName').textContent=S.name;$('#hLv').textContent='Lv '+S.lv;
 S.fat=clamp(S.fat,0,maxFat());const f=S.fat/maxFat();$('#hFat').style.width=Math.round(100*f)+'%';$('#hFatBar').classList.toggle('low',f<.25);$('#hFatBar').classList.toggle('mid',f>=.25&&f<.5);
 $('#hFatL').innerHTML=Z('fatigue');$('#hFatN').textContent=`${S.fat}/${maxFat()}`;$('#hXp').style.width=Math.round(100*S.xp/xpNeed(S.lv))+'%';
 $('#hMoney').textContent='NT$'+S.money;$('#hBadge').textContent=`★ ${S.badges}/22`;
 $('#rubyBtn').innerHTML=Z(S.settings.ruby==='off'?'off':S.settings.ruby);$('#menuBtn').innerHTML=Z('menu')}
let tagT;function showCityTag(){const t=$('#cityTag');const c=CITIES[S.city];t.innerHTML=`${rb(c.zh)} <span class="tl">${S.city+1}/22 · ${esc(LI()===2?c.ja:c.en)}</span>`;t.style.opacity=1;clearTimeout(tagT);tagT=setTimeout(()=>t.style.opacity=0,2800)}
let toastT;function toast(l){const t=$('#toast');t.classList.toggle('top',!$('#ov').hidden);t.innerHTML=Array.isArray(l)?`${rb(l[0])}<span class="tl">${esc(l[LI()])}</span>`:esc(l);t.hidden=false;t.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.hidden=true,400)},2200)}

/* ---------- 成長 ---------- */
function xpFor(lv){const mult=clamp(1+.15*(lv-S.lv),.2,2.5);return{g:Math.max(1,Math.round((8+lv*2)*mult*(has('dog')?1.2+.02*(petLv('dog')-1):1))),mult}}
function gainXP(g){S.xp+=g;let up=false;while(S.xp>=xpNeed(S.lv)){S.xp-=xpNeed(S.lv);S.lv++;up=true;S.fat+=5}if(up)toast([UI.levelUp[0]+' Lv '+S.lv,UI.levelUp[1]+' Lv '+S.lv,UI.levelUp[2]+' Lv '+S.lv]);hud()}
function gainMoney(n){n=Math.round(n*(has('magpie')?1.3+.02*(petLv('magpie')-1):1));S.money+=n;return n}
function dmgFor(lv){if(S.luck>0){S.luck--;return 0}const gap=S.lv-lv;const m=gap>0?Math.min(2,1+.03*gap):Math.max(.6,1+.02*gap);return Math.max(2,Math.round((5+S.lv*.9)*m*(has('bear')?Math.max(.5,.75-.01*(petLv('bear')-1)):1)))}
function markSeen(it,ok){if(it.t!=='v')return;const s=S.seen[it.w]||{n:0,ok:0};s.n++;if(ok)s.ok++;S.seen[it.w]=s}

/* ---------- 出題 ---------- */
function near(pool,it,n,key){return shuffle(pool.filter(o=>o!==it&&o[key]!==it[key]&&itemTr(o)!==itemTr(it)).sort((a,b)=>Math.abs(a.lv-it.lv)-Math.abs(b.lv-it.lv)).slice(0,8)).slice(0,n)}
function makeQ(it){
 if(it.t==='v'&&ttsOK()&&S.settings.ruby!=='off'&&Math.random()<.3){const q=toneQ(it);if(q)return q}
 if(it.t==='v'){const ds=near(ALLV,it,3,'w');
  if(Math.random()<.55)return build({label:'whatMean',zh:it.w,opts:[itemTr(it),...ds.map(itemTr)],optZh:false,it});
  return build({label:'whichOne',tl:itemTr(it),opts:[it.w,...ds.map(d=>d.w)],optZh:true,it})}
 if(it.t==='g')return build({label:'fill',zh:it.s,opts:[it.a,...it.d.slice(0,3)],optZh:true,exZh:it.s.replace('＿＿',it.a),exTl:itemTr(it),it});
 if(it.t==='l'){const ds=near(ALLL,it,3,'s');
  if(!ttsOK()||S.lv<20||Math.random()<.6)return build({label:'whatHear',audio:it.s,opts:[itemTr(it),...ds.map(itemTr)],optZh:false,exZh:it.s,exTl:itemTr(it),it});
  return build({label:'whichHeard',audio:it.s,opts:[it.s,...ds.map(d=>d.s)],optZh:true,exTl:itemTr(it),it,hideText:true})}
 if(it.t==='r')return build({label:'reading',passage:it.p,qzh:it.q,opts:[it.a,...it.d],optZh:true,it})}
const SWAPS=[['zh','z'],['ch','c'],['sh','s'],['n','l'],['b','p'],['d','t'],['g','k'],['j','q']],FSWAPS=[['ang','an'],['ing','in'],['eng','en'],['ong','eng']];
function swapSound(syl){const p=parseSyl(syl);if(!p)return syl;let[s,t]=p;const opts=[];
 SWAPS.forEach(([a,b])=>{if(s.startsWith(a)&&!(a==='z'&&s.startsWith('zh'))&&!(a==='c'&&s.startsWith('ch'))&&!(a==='s'&&s.startsWith('sh')))opts.push(b+s.slice(a.length));if(s.startsWith(b)&&!(b.length===1&&s.startsWith(b+'h')))opts.push(a+s.slice(b.length))});
 FSWAPS.forEach(([a,b])=>{if(s.endsWith(a))opts.push(s.slice(0,-a.length)+b);else if(s.endsWith(b)&&!s.endsWith(a))opts.push(s.slice(0,-b.length)+a)});
 return opts.length?pick(opts)+t:null}
function toneQ(it){const syls=segment(it.w).map(x=>x[1]);if(!syls.length||syls.some(x=>!x))return null;const key=a=>a.join(' ');const base=key(syls);const out=new Set();let n=0;
 while(out.size<3&&n<80){n++;const v=syls.slice();const k=Math.floor(Math.random()*v.length);
  if(Math.random()<.65){const p=parseSyl(v[k]);let nt;do{nt=1+Math.floor(Math.random()*4)}while(nt===p[1]);v[k]=p[0]+nt;if(v.length>1&&Math.random()<.3){const j=(k+1)%v.length,q=parseSyl(v[j]);let t2;do{t2=1+Math.floor(Math.random()*4)}while(t2===q[1]);v[j]=q[0]+t2}}
  else{const sw=swapSound(v[k]);if(!sw)continue;v[k]=sw}
  if(key(v)!==base)out.add(key(v))}
 if(out.size<3)return null;const zy=S.settings.ruby==='zhuyin';const fmt=s=>s.split(' ').map(x=>zy?toZhu(x):toMark(x)).join(zy?' ':' ');
 return build({label:zy?'whichZhuyin':'whichPinyin',audio:it.w,opts:[fmt(base),...[...out].map(fmt)],optZh:false,exZh:it.w,exTl:itemTr(it),it,hideText:true,toneQ:true})}
function build(o){const c=o.opts[0];const opts=shuffle(o.opts.slice(0,4));return{...o,opts,ci:opts.indexOf(c)}}

/* ---------- 面板 ---------- */
function openPanel(html,m='menu'){$('#panel').innerHTML=html;$('#ov').hidden=false;mode=m;held=null;$('#panel').scrollTop=0;
 const f=$('#panel').querySelector('[data-autofocus]')||$('#panel').querySelector('button');if(f)f.focus({preventScroll:true})}
function closePanel(){$('#ov').hidden=true;$('#panel').innerHTML='';hush();mode='world';hud();save()}
function closePanelQuiet(){$('#ov').hidden=true;$('#panel').innerHTML='';mode='world'}
document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closePanel()});
const head=(k,extra='')=>`<div class="ptitle"><h2>${Z(k)}<span class="tl">${T(k)}</span></h2>${extra}<button class="x" data-close>${Z('close')}</button></div>`;
const backBtn=()=>`<button class="x" id="backBtn">◀ ${Z('back')}</button>`;
function wireBack(){const b=$('#backBtn');if(b)b.onclick=()=>{closePanelQuiet();mainMenu()}}
const btn=(id,k,cls='',attrs='')=>`<button class="btn ${cls}" id="${id}" ${attrs}>${Z(k)}<span class="tl">${T(k)}</span></button>`;

/* ---------- 對戰 ---------- */
let B=null;
function startBattle(foe){B={foe,cut:has('cat')?1+Math.floor((petLv('cat')-1)/5):0,done:0,total:foe.total||3,hits:0};
 openPanel(`<div class="arena"><canvas id="arenaCv"></canvas>
  <div class="card bcard foe"><div class="nm">${rb(foe.zh)}<span class="tl">${esc(foe.sub)}</span><span class="lv">Lv ${foe.lv}</span></div><div class="segs" id="foeSeg"></div></div>
  <div class="card bcard mine"><div class="nm">${esc(S.name)} <span class="lv">Lv ${S.lv}</span></div><div class="lbl">${Z('fatigue')} <span id="bFatN"></span></div><div class="bar st" id="bFatBar"><i id="bFat"></i></div></div></div>
  <div class="pbody" id="bbody"></div>`,'battle');
 requestAnimationFrame(drawArena);segs();fatBar()}
function drawArena(){const c=$('#arenaCv');if(!c||!B)return;const w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);c.width=w*d;c.height=h*d;const g=c.getContext('2d');g.scale(d,d);
 const city=CITIES[S.city];g.fillStyle=lg(g,0,0,0,h,['#9fd6ff','#e8f6ff']);g.fillRect(0,0,w,h);
 g.fillStyle=shade(city.roof,.55);g.beginPath();g.moveTo(0,h*.55);for(let x=0;x<=w;x+=w/8)g.lineTo(x,h*.42+Math.sin(x*.02)*h*.06);g.lineTo(w,h);g.lineTo(0,h);g.fill();
 g.fillStyle=lg(g,0,h*.55,0,h,['#9fdc7a','#6cbf55']);g.fillRect(0,h*.6,w,h*.4);
 ell(g,w*.72,h*.58,Math.min(w*.2,170),h*.09);g.fillStyle='#7ccb62';g.fill();g.lineWidth=3;g.strokeStyle='rgba(27,35,64,.35)';g.stroke();
 ell(g,w*.24,h*1.02,Math.min(w*.22,190),h*.1);g.fillStyle='#7ccb62';g.fill();g.stroke();
 const s=Math.min(h*.42,w*.26);
 if(B.foe.kind==='person')drawChar(g,w*.72,h*.6,s,B.foe.look,'down',0,true);else drawAnimal(g,B.foe.kind,w*.72,h*.61,s*1.1);
 drawChar(g,w*.2,h*1.22,s*1.05,playerLook(),'up',0,true)}
function segs(){const el=$('#foeSeg');if(!el)return;if(B.love!=null){el.style.cssText='display:grid;grid-template-columns:auto 1fr;gap:3px 6px;align-items:center';el.innerHTML=`<span class="lbl">${Z('affection')}</span><span class="segs" style="margin:0">${Array.from({length:3},(_,i)=>`<i class="${i<B.love?'love':'empty'}"></i>`).join('')}</span><span class="lbl">${Z('fatigue')}</span><span class="segs" style="margin:0">${Array.from({length:B.total},(_,i)=>`<i class="${i<B.hits?'gone':''}"></i>`).join('')}</span>`;return}
 el.innerHTML=Array.from({length:B.total},(_,i)=>`<i class="${i<B.hits?'gone':''}"></i>`).join('')}
function fatBar(){const f=S.fat/maxFat();const b=$('#bFat');if(b){b.style.width=Math.round(100*f)+'%';$('#bFatBar').classList.toggle('low',f<.25);$('#bFatBar').classList.toggle('mid',f>=.25&&f<.5);$('#bFatN').textContent=`${S.fat}/${maxFat()}`}hud()}
function askQ(q,next,onAnswer){const body=$('#bbody');const listen=!!q.audio,can=ttsOK();
 let h=`<div class="q">`;
 if(q.passage)h+=`<div class="passage">${rb(q.passage)}</div>`;
 h+=`<div class="qlabel">${Z(q.label)}<span class="tl">${T(q.label)}</span></div>`;
 if(q.qzh)h+=`<div class="qprompt sm">${rb(q.qzh)}</div>`;
 if(q.zh)h+=`<div class="qprompt">${rb(q.zh)}</div>`;
 if(q.tl)h+=`<div class="qprompt tlp">${esc(q.tl)}</div>`;
 if(listen){if(can)h+=`<div class="row"><button class="play" id="playBtn" data-autofocus>▶ ${Z('play')}<span class="tl">${T('play')}</span></button>${has('bird')?`<button class="play" id="slowBtn" style="background:#4a5478">▶ ${Z('slow')}<span class="tl">${T('slow')}</span></button>`:''}</div>`;
  else h+=`<div class="note">${Z('noVoice')}<br>${T('noVoice')}</div>${q.hideText?'':`<div class="qprompt sm">${rb(q.audio)}</div>`}`}
 h+=`<div class="opts">${q.opts.map((o,i)=>`<button class="opt ${q.optZh?'':'tlo'}" data-i="${i}"><span class="k">${i+1}</span><span>${q.optZh?rb(o):esc(o)}</span></button>`).join('')}</div>`;
 if(B.cut)h+=`<div class="row"><button class="btn alt" id="cutBtn">🐾 ${rb('貓的直覺')}<span class="tl">${esc(tr(['',ANIMALS[0].ab[0],ANIMALS[0].ab[1]]))}</span></button></div>`;
 h+=`<div class="fb" id="fb"></div></div>`;body.innerHTML=h;
 if(listen&&!can&&q.hideText){/* 沒有臺灣語音時，選項本身就是文字，改用意思題 */}
 const pb=$('#playBtn');if(pb){pb.onclick=()=>speak(q.audio);setTimeout(()=>speak(q.audio),400)}
 const sb=$('#slowBtn');if(sb)sb.onclick=()=>speak(q.audio,.6);
 const cb=$('#cutBtn');if(cb)cb.onclick=()=>{const wr=[...body.querySelectorAll('.opt')].filter(b=>+b.dataset.i!==q.ci&&!b.disabled);if(wr.length){const w=pick(wr);w.classList.add('cut');w.disabled=true}B.cut--;if(B.cut<=0)cb.remove()};
 let done=false;
 body.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const ok=+b.dataset.i===q.ci;
  body.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.i===q.ci)x.classList.add('right')});if(!ok)b.classList.add('wrong');
  const msg=onAnswer(ok,listen&&!can);let fb=ok?`<span class="good">${Z('correct')}</span> <span class="tl" style="display:inline">${T('correct')}</span> `:`<span class="bad">${Z('wrong')}</span> <span class="tl" style="display:inline">${T('wrong')}</span> `;
  fb+=`<div>${msg}</div>`;if(q.exZh&&(q.it.t!=='v'||q.toneQ))fb+=`<div>${rb(q.exZh)}</div>`;if(q.exTl)fb+=`<span class="tl">${esc(q.exTl)}</span>`;
  $('#fb').innerHTML=fb+`<div class="row" style="margin-top:8px">${btn('nextBtn','next')}</div>`;const nb=$('#nextBtn');nb.focus({preventScroll:true});nb.scrollIntoView?.({block:'nearest'});nb.onclick=()=>{hush();next()}})}
function score(it,ok,textOnly){const lv=it.lv??cityLv(S.city);
 if(!ok){const d=dmgFor(lv);S.fat=Math.max(0,S.fat-d);fatBar();return d?`<span class="bad">${Z('fatigue')} −${d}</span>`:`🍀 ${rb('好運！這次不會累。')}`}
 let{g,mult}=xpFor(lv);if(textOnly)g=Math.ceil(g/2);const m=gainMoney(4+Math.round(lv/2));gainXP(g);fatBar();
 const note=mult<.6?` · ${Z('tooEasy')}<span class="tl" style="display:inline"> ${T('tooEasy')}</span>`:mult>1.3?` · ${Z('bonus')}<span class="tl" style="display:inline"> ${T('bonus')}</span>`:'';
 return`<b>+${g} EXP · +NT$${m}</b>${note}`}
function endCard(lines,btns){$('#bbody').innerHTML=`<div class="q">${lines}<div class="row">${btns}</div></div>`;const b=$('#bbody button');if(b)b.focus()}
const toMapBtn=()=>`<button class="btn" data-close>${Z('toMap')}<span class="tl">${T('toMap')}</span></button>`;
function runSeries(items,opts){let i=0;
 const step=()=>{if(S.fat<=0)return faint();
  if(i>=items.length)return opts.end();
  const it=items[i];askQ(opts.make?opts.make(it):makeQ(it),()=>{i++;step()},(ok,textOnly)=>{markSeen(it,ok);if(ok){B.hits++;segs()}opts.onAns&&opts.onAns(ok);return score(it,ok,textOnly)})};
 step()}
function faint(){const fee=Math.min(S.money,innFee());S.money-=fee;S.fat=maxFat();if(MAP.kind==='in'){MAP=TOWN;rebuild()}S.x=MAP.inn.x;S.y=MAP.inn.y;S.dir='down';save();hud();
 endCard(`<div class="qprompt">${Z('faint')}</div><div class="qprompt tlp">${T('faint')}</div><div class="note">${Z('faintMsg')} ${T('faintMsg')} · ${Z('fee')} NT$${fee}</div>`,toMapBtn())}

/* ---------- 遭遇 ---------- */
function poolFor(ci){let p=POOLS[ci].slice();if(ci>0)p=p.concat(shuffle(POOLS[ci-1]).slice(0,4));
 [...new Set(S.pets.map(p=>p.sp))].forEach(id=>{const a=ANIMALS.find(x=>x.id===id);p=p.concat(a.items.map(i=>norm(i,cityLv(ci)+1)))});return p}
function startEncounter(){const ci=S.city;const ok=ANIMALS.filter(a=>a.minCity<=ci);
 if(Math.random()<.32){let tot=ok.reduce((s,a)=>s+a.w,0),r=Math.random()*tot,a=ok[0];for(const x of ok){r-=x.w;if(r<=0){a=x;break}}animalEncounter(a)}
 else{const d=pick(TRAINERS);personBattle(d,{hair:d.hair,top:d.top,bottom:'#3d4766',style:d.style,cap:'#3a7bd5'},cityLv(ci),'wildPerson',d.hi,d.lose,3,null)}}
function trainerBattle(t){const d=tdata(t);personBattle(d,trainerLook(t),t.lv,t.guard?'guard':'trainer',d.hi,d.lose,t.guard?3:4,t)}
function personBattle(d,look,lv,titleKey,hi,lose,n,trainer){const items=shuffle(poolFor(S.city)).slice(0,n);
 startBattle({kind:'person',zh:d.zh,sub:tr(['',d.en,d.ja]),look,lv,total:n});
 endCard(`<div class="qlabel">${Z(titleKey)}<span class="tl">${T(titleKey)}</span></div><div class="qprompt sm">${rb(hi[0])}</div><div class="tl">${esc(hi[LI()])}</div>`,
  btn('goBtn','start','','data-autofocus')+(trainer?'':btn('runBtn','run','alt')));
 $('#goBtn').onclick=()=>runSeries(items,{end:()=>{const win=B.hits>=Math.ceil(n/2);
   if(win&&trainer){S.beaten[trainer.id]=1;const m=gainMoney(40+trainer.lv*6);gainXP(Math.round(xpFor(trainer.lv).g*1.5));save();
    endCard(`<div class="qprompt">${Z('won')}</div><div class="tl">${T('won')} +NT$${m}</div><div class="qprompt sm">${rb(lose[0])}</div><div class="tl">${esc(lose[LI()])}</div>`,toMapBtn());return}
   endCard(`<div class="qprompt">${Z(win?'won':'lost')}</div><div class="tl">${T(win?'won':'lost')} · ${B.hits}/${n}</div>`,toMapBtn())}});
 const rb2=$('#runBtn');if(rb2)rb2.onclick=closePanel}
function animalEncounter(a){const name=tr(['',a.en,a.ja]);const MAXT=6;let turns=0;
 startBattle({kind:a.id,zh:'野生的'+a.zh,sub:name,lv:cityLv(S.city),total:4});B.love=0;segs();
 const menu=(msgZh,msgTl)=>{if(S.fat<=0)return faint();
  endCard(`<div class="qlabel">${Z('wildAnimal')}<span class="tl">${T('wildAnimal')}</span></div><div class="qprompt sm">${rb(msgZh)}</div><div class="tl">${esc(msgTl)}</div>
   <div class="note">${rb('答對問題或餵零食，好感滿三顆就能馴養！牠累了就會跑回草叢。')}<br>${esc(tr(['',"Answer correctly or feed a snack: three hearts and it joins you. When it runs out of stamina, it heads back into the grass.","正解するかおやつをあげて、ハート3つで仲間に。スタミナが尽きると草むらに帰ってしまう。"]))}${has(a.id)?`<br>${rb('你已經有'+S.pets.filter(p=>p.sp===a.id).length+'隻'+a.zh+'了，還可以再馴養。')}`:''}</div>`,
   btn('tQ','answer','','data-autofocus')+btn('tS','feed','sun',S.bag.snack<1?'disabled':'')+` <span class="note">${Z('snack')} ×${S.bag.snack}</span>`+btn('tR','leave','alt'));
  $('#tR').onclick=closePanel;
  $('#tS').onclick=()=>{S.bag.snack--;B.love++;turns++;segs();after(`${a.zh}吃了零食，很開心！`,tr(['',`The ${a.en.toLowerCase()} loved the snack!`,`${a.ja}はおやつを喜んだ！`]))};
  $('#tQ').onclick=()=>{const src=Math.random()<.5?a.items.map(i=>norm(i,cityLv(S.city)+1)):poolFor(S.city);const it=pick(src);
   askQ(makeQ(it),()=>after(B.lastOk?`${a.zh}好像比較喜歡你了。`:`${a.zh}有一點緊張……`,B.lastOk?tr(['',"It seems to like you more.","少しなついたみたい。"]):tr(['',"It looks a little nervous…","ちょっと警戒している……"])),
    (ok,textOnly)=>{B.lastOk=ok;turns++;markSeen(it,ok);if(ok){B.love++;B.hits++;segs()}const m=score(it,ok,textOnly);if(!ok&&Math.random()<.3)B.fled=true;return m})}};
 const after=(z,t)=>{if(B.love>=3){const pet={sp:a.id,nick:'',lv:1,xp:0};S.pets.push(pet);if(a.id==='leopard')S.fat=maxFat();gainXP(30+cityLv(S.city)*3);save();
   endCard(`<div class="qprompt">${Z('tamed')}</div><div class="qprompt sm">${rb(a.zh+'加入了旅程。')}</div><div class="tl">${esc(name)} · ${esc(tr(['',...a.ab]))}</div>
    <div class="qlabel" style="margin-top:6px">${Z('nickQ')}<span class="tl">${T('nickQ')}</span></div><input type="text" id="nickIn" maxlength="8" placeholder="${esc(a.zh)}" autocomplete="off">`,
    btn('nickOk','nickBtn','sun')+btn('nickNo','noNick','alt'));
   const fin=()=>{save();endCard(`<div class="qprompt">${rb(petName(pet))}</div><div class="tl">${esc(name)} Lv 1</div>`,toMapBtn())};
   $('#nickOk').onclick=()=>{pet.nick=($('#nickIn').value||'').trim().slice(0,8);fin()};$('#nickNo').onclick=fin;$('#nickIn').onkeydown=e=>{if(e.key==='Enter')$('#nickOk').click()};return}
  if(B.fled)return endCard(`<div class="qprompt">${rb(a.zh+'跑走了！')}</div><div class="tl">${T('fled')}</div>`,toMapBtn());
  if(B.hits>=B.total||turns>=MAXT){gainXP(Math.round(xpFor(cityLv(S.city)).g/2));save();
   return endCard(`<div class="qprompt">${rb(a.zh+'累了，跑回草叢休息了。')}</div><div class="tl">${esc(tr(['',`The ${a.en.toLowerCase()} got tired and went back into the grass.`,`${a.ja}は疲れて草むらへ帰っていった。`]))}</div>`,toMapBtn())}
  menu(z,t)};
 menu(`野生的${a.zh}看著你。`,tr(['',`A wild ${a.en.toLowerCase()} is watching you.`,`野生の${a.ja}がこっちを見ている。`]))}


/* ---------- 室內：可以走進去，跟櫃檯人員說話 ---------- */
const CLERK={inn:{hair:'#3b2a1a',top:'#ff5b4a',trim:'#fff',bottom:'#2b3a66',style:'bun'},store:{hair:'#141210',top:'#14b3a4',trim:'#ff9f2e',bottom:'#2b3a66',style:'short'},
 tea:{hair:'#5a3a22',top:'#d9a066',trim:'#fff',bottom:'#3d4766',style:'pony'},temple:{hair:'#a9a59a',top:'#f2b632',trim:'#c8372d',bottom:'#3d4766',style:'short'}};
const CLERK_NAME={inn:['櫃檯人員',"Receptionist","受付係"],store:['店員',"Clerk","店員"],tea:['店員',"Barista","店員"],temple:['廟公',"Temple keeper","廟の管理人"]};
const GUARD={zh:'道館守護人員',en:"Gym guard",ja:"ジムトレーナー",hi:['想挑戰館主？先過我這關！',"Want to face the leader? Get past me first!","ジムリーダーに挑戦したい？まずは私を倒して！"],lose:['你可以往前走了！',"You may go on ahead!","先へ進んでいいよ！"]};
function guardLook(ci,k){const c=CITIES[ci];return{hair:['#141210','#3b2a1a','#2a1d18'][k%3],top:shade(c.roof,-.1),trim:'#ffd35a',bottom:'#1b2340',style:['short','pony','cap'][k%3],cap:'#1b2340'}}
function genInterior(kind,ci,ret){const gym=kind==='gym',w=11,h=gym?16:10;const g=Array.from({length:h},()=>Array(w).fill(GT.G));
 const blocked=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||x===w-1||y<2||(y===h-1&&x!==5)));
 const furn=[],npcs=[],trainers=[],walkers=[];const add=(t,x,y,fw=1,fh=1)=>{furn.push({t,x,y,w:fw,h:fh});for(let yy=y;yy<y+fh;yy++)for(let xx=x;xx<x+fw;xx++)blocked[yy][xx]=true};
 if(gym){[[1,5],[9,5],[1,9],[9,9],[1,13],[9,13]].forEach(([x,y])=>add('pillar',x,y));furn.push({t:'platform',x:3,y:2,w:5,h:2});add('plant',2,2);add('plant',8,2);
  npcs.push({x:5,y:2,dir:'down',role:'leader',look:leaderLook(ci)});
  [[3,12,'right'],[7,9,'left'],[3,6,'right']].forEach(([x,y,dir],k)=>trainers.push({id:ci+'-g'+k,x,y,dir,home:dir,guard:true,lv:cityLv(ci)+1+k,turnT:2200+k*700,look:guardLook(ci,k)}))}
 else{for(let x=1;x<w-1;x++)blocked[2][x]=true;add('counter',3,3,5,1);npcs.push({x:5,y:2,dir:'down',role:'clerk',kind,look:CLERK[kind]});
  if(kind==='store'){add('shelf',1,5,2,1);add('shelf',1,7,2,1);add('shelf',8,5,2,1);add('shelf',8,7,2,1);add('plant',9,3);add('rack',1,3)}
  if(kind==='inn'){add('sofa',1,5,2,1);add('sofa',8,5,2,1);add('plant',1,3);add('plant',9,3);add('dispenser',9,8)}
  if(kind==='tea'){add('table',2,6);add('table',8,6);add('plant',1,3);add('plant',9,3)}
  if(kind==='temple'){add('burner',5,6);add('pillar',1,4);add('pillar',9,4);add('pillar',1,7);add('pillar',9,7);add('cushion',3,4);add('cushion',7,4)}
  const free=[];for(let y=4;y<h-1;y++)for(let x=1;x<w-1;x++)if(!blocked[y][x]&&!(x===5&&y>=h-2))free.push([x,y]);
  const R2=Math.random;for(let k=0;k<2+(R2()<.5?1:0);k++){const[x,y]=free.splice(Math.floor(R2()*free.length),1)[0];const d=pick(TRAINERS);
   walkers.push({x,y,dir:pick(['up','down','left','right']),look:{hair:d.hair,top:d.top,bottom:'#3d4766',style:d.style,cap:'#3a7bd5'},line:pick(WALKER_LINES),gift:R2()<.35?pick(['snack','drink','bubble']):null,wt:800+R2()*1500,who:d.zh})}}
 return{kind:'in',bk:kind,ci,w,h,g,blocked,furn,npcs,trainers,walkers,objs:[],doors:{},exit:{x:5,y:h-1},ret}}
function enterInterior(kind,dx,dy){$('#cityTag').style.opacity=0;TOWN=MAP;MAP=genInterior(kind,S.city,{x:dx,y:dy+1});S.x=5;S.y=MAP.h-2;S.dir='up';mv=null;held=null;fit();rebuild();
 const nm=kind==='gym'?UI.gym:UI[kind];toast([CITIES[S.city].zh+nm[0],`${CITIES[S.city].en} ${nm[1]}`,`${CITIES[S.city].ja}の${nm[2]}`])}
function leaveInterior(){if(CH)CH.cancel();$('#dlg').hidden=true;const r=MAP.ret;MAP=TOWN;S.x=r.x;S.y=r.y;S.dir='down';mv=null;held=null;fit();rebuild();save()}
function talkNpc(n){if(n.role==='leader')return leaderTalk();n.dir='down';shopFlow(n.kind)}
async function talkWalker(n){n.talk=true;const back={up:'down',down:'up',left:'right',right:'left'};n.dir=back[S.dir];await say([n.line],n.who);
 if(n.gift){const k=n.gift;n.gift=null;S.bag[k]++;save();hud();await say([UI.gift,[`${UI.got[0]}${UI[k][0]}！`,`${UI.got[1]}: ${UI[k][1]}!`,`${UI[k][2]}を${UI.got[2]}！`]],n.who)}n.talk=false}
const opt=(k,extra='')=>`${Z(k)}${extra} <span class="tl" style="display:inline">${T(k)}</span>`;
const SHOP_ITEMS={store:[['snack',50],['drink',120]],tea:[['bubble',70]]};
async function shopFlow(kind){const nm=CLERK_NAME[kind][0];const hello={inn:UI.innHello,store:UI.storeHello,tea:UI.teaHello,temple:UI.templeHello}[kind];
 if(kind==='inn'){const i=await ask(hello,nm,[opt('rest',` NT$${innFee()}`),opt('leave')]);
  if(i===0){if(S.fat>=maxFat())await say([UI.innFull],nm);else if(S.money<innFee())await say([UI.notEnoughL],nm);
   else{const c=await ask([`休息一下要NT$${innFee()}，可以嗎？`,`A rest costs NT$${innFee()}. OK?`,`ご休憩はNT$${innFee()}です。よろしいですか？`],nm,[opt('yes'),opt('no')]);
    if(c===0){S.money-=innFee();S.fat=maxFat();save();hud();await healFx();await say([UI.innDone],nm)}else await say([UI.maybeLater],nm)}}
  return say([UI.comeAgain],nm)}
 if(kind==='temple'){const i=await ask(hello,nm,[opt('pray'),opt('fortune'),opt('leave')]);
  if(i===0){save();await say([UI.prayed],nm)}
  if(i===1){const f=pick(FORTUNES);if(f[0]==='大吉')S.bag.snack++;if(f[0]==='中吉')S.luck=1;await say([[f[0]+'！',f[1],f[2]]],nm)}
  return say([UI.comeAgain],nm)}
 let line=hello;
 while(true){const i=await ask(line,nm,[opt('buy'),opt('leave')]);line=UI.anythingElse;if(i!==0)break;
  const list=SHOP_ITEMS[kind];const j=await choice([...list.map(([k,p])=>`${Z(k)} <span class="tl" style="display:inline">${T(k)}</span><span class="pr">NT$${p}</span>`),opt('cancel')],{title:`NT$${S.money}`,cls:'wide'});
  if(j<0||j>=list.length)continue;const[k,p]=list[j];
  if(S.money<p){await say([UI.notEnoughL],nm);continue}
  mode='dialog';await showLine(UI.howMany,nm);const q=await qtyBox(`${Z(k)} · NT$${p}`,p);$('#dlg').hidden=true;if(!q)continue;
  const u=UNIT[k]||'個',it=UI[k];
  const c=await ask([`${it[0]}${q}${u}，一共NT$${q*p}，可以嗎？`,`${q} × ${it[1]}: NT$${q*p}. OK?`,`${it[2]}を${q}つで、NT$${q*p}です。よろしいですか？`],nm,[opt('yes'),opt('no')]);
  if(c===0){S.money-=q*p;S.bag[k]+=q;hud();save();await say([UI.thanks],nm)}else await say([UI.maybeLater],nm)}
 return say([UI.comeAgain],nm)}
function leaderTalk(){const ci=S.city,c=CITIES[ci];
 if(S.badges>ci){dialog([[`你已經拿到${c.zh}的徽章了！繼續往下一站吧。`,`You already have the ${c.en} badge. Head on to the next city!`,`${c.ja}のバッジはもう持っているね。次の町へ進もう！`]],null,c.leader);return}
 const left=MAP.trainers.filter(t=>t.guard&&!S.beaten[t.id]).length;
 if(left){dialog([[`要先打敗所有道館守護人員，才能挑戰館主喔！還有${['零','一','兩','三'][left]}位。`,`Defeat all the gym guards before challenging the leader! ${left} left.`,`ジムトレーナーを全員倒してから挑戦してね！あと${left}人。`]],null,c.leader);return}
 dialog([...c.hello,UI.trialRule],()=>gymTrial(ci),c.leader)}

/* ---------- 道館 ---------- */
function leaderLook(ci){const c=CITIES[ci];return{hair:['#2a1d18','#3b2a1a','#141210','#5a3a22'][ci%4],top:c.roof,trim:'#ffd35a',bottom:'#2b3a66',style:['short','pony','cap','bun','short'][ci%5],cap:shade(c.roof,-.2)}}
function enterGym(){const ci=S.city,c=CITIES[ci];
 if(S.badges>ci){dialog([[`你已經拿到${c.zh}的徽章了！繼續往下一站吧。`,`You already have the ${c.en} badge. Head on to the next city!`,`${c.ja}のバッジはもう持っているね。次の町へ進もう！`]],null,c.leader);return}
 dialog([...c.hello,UI.trialRule],()=>gymTrial(ci),c.leader)}
function gymTrial(ci){const c=CITIES[ci];const lv=cityLv(ci)+2;
 startBattle({kind:'person',zh:'館主 '+c.leader,sub:tr(['',...c.role]),look:leaderLook(ci),lv,total:6});
 const rd=pick([c.read,c.read2].filter(Boolean));const reads=shuffle(rd.qs).map(q=>({t:'r',p:rd.p,q:q[0],a:q[1],d:q[2].split('|'),lv}));
 const lis=shuffle(POOLS[ci].filter(x=>x.t==='l')).slice(0,3).map(x=>({...x,lv}));
 let phase=0,okc=0;
 const intro=(k,go)=>endCard(`<div class="qlabel">${Z('gym')} · ${rb(c.zh)}</div><div class="qprompt">${Z(k)}</div><div class="tl">${T(k)} · ${T('trialRule')}</div>`,btn('goT','start','','data-autofocus')),
  wire=go=>{$('#goT').onclick=go};
 const run=list=>runSeries(list,{onAns:ok=>{if(ok)okc++},end:()=>{
   if(okc<2)return endCard(`<div class="qprompt sm">${rb(c.leader+'：再去草叢修練一下吧！')}</div><div class="tl">${T('trainMore')} (${okc}/3)</div>`,toMapBtn());
   if(phase===0){phase=1;okc=0;intro('trialListen');wire(()=>run(lis));return}
   winGym(ci)}});
 intro('trialRead');wire(()=>run(reads))}
function winGym(ci){const c=CITIES[ci];S.badges=Math.max(S.badges,ci+1);const g=60+ci*25;gainXP(g);const m=gainMoney(300+ci*80);S.fat=maxFat();save();hud();
 const nxt=ci<21?CITIES[ci+1]:null;
 endCard(`<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div style="width:110px">${badgeSVG(ci,true)}</div><div style="flex:1;min-width:200px">
  <div class="qprompt">${rb(c.zh+'徽章')}</div><div class="tl">${T('badgeGet')} +${g} EXP · +NT$${m}</div>
  <div class="note" style="margin-top:6px">${nxt?`${rb('下一站：'+nxt.zh)} · ${esc(tr(['',`Next: ${nxt.en}, through the gate at the bottom of the map.`,`次は${nxt.ja}。マップ下のゲートから進もう。`]))}`:`${rb('二十二個徽章都到手了！')} ${esc(tr(['',"All 22 badges! Open the map to enter the Language League.","バッジ22個コンプリート！マップから言語大リーグへ。"]))}`}</div></div></div>`,
  `<button class="btn sun" data-close>${rb('太棒了！')}</button>`)}

/* ---------- 聯盟 ---------- */
function leagueTier(t){const L=LEAGUE[t];let src=L.pool?L.pool.map(x=>norm(x)):[];if(L.from){for(let ci=L.from[0];ci<=L.from[1];ci++)src=src.concat(POOLS[ci].map(x=>({...x,lv:x.lv+10})))}
 const items=shuffle(src).slice(0,5);const lv=Math.max(...items.map(i=>i.lv));
 startBattle({kind:'person',zh:'評審 '+L.judge,sub:`${UI.league[LI()]} · ${tr(['',L.en,L.ja])}`,look:{hair:'#14151c',top:'#ffc93c',trim:'#1b2340',bottom:'#1b2340',style:t%2?'short':'bun'},lv,total:5});
 endCard(`<div class="qlabel">${Z('league')} · ${rb(L.zh)}</div><div class="qprompt sm">${rb(L.judge+'：歡迎來到'+L.zh+'的考場。')}</div><div class="tl">${esc(tr(['',L.en,L.ja]))} · ${esc(tr(['',"5 questions, 4 correct to pass. Tiers follow the six TOCFL levels.","全5問、4問正解で合格。6段階はTOCFLの等級に対応。"]))}</div>`,btn('go','start','','data-autofocus')+`<button class="btn alt" data-close>${Z('leave')}</button>`);
 $('#go').onclick=()=>runSeries(items,{end:()=>{if(B.hits>=4){S.league=Math.max(S.league,t+1);const m=gainMoney(500+t*300);gainXP(150+t*80);S.fat=maxFat();if(t===5)S.champion=true;save();
   endCard(`<div class="qprompt">${t===5?rb('你是語言大聯盟的冠軍！'):Z('pass')}</div><div class="tl">${t===5?esc(tr(['',"You are the Language League Champion!","言語大リーグのチャンピオンだ！"])):T('pass')} +NT$${m}</div>`,(t<5?btn('nt','nextTier','sun'):'')+toMapBtn());const n=$('#nt');if(n)n.onclick=()=>leagueTier(t+1)}
  else endCard(`<div class="qprompt">${Z('fail')}</div><div class="tl">${T('fail')} · ${B.hits}/5</div>`,toMapBtn())}})}

/* ---------- 商店 ---------- */
function portrait(look,kind){const c=document.createElement('canvas');c.className='portrait';c.width=192;c.height=192;const g=c.getContext('2d');
 if(kind)drawAnimal(g,kind,96,170,150);else drawChar(g,96,205,160,look,'down',0,true);return c}
function shop(kindKey,helloKey,look,bodyHtml,wire){openPanel(head(kindKey)+`<div class="pbody"><div class="row" style="flex-wrap:nowrap"><span id="pt"></span><div><div class="qprompt sm">${Z(helloKey)}</div><div class="tl">${T(helloKey)}</div></div></div>${bodyHtml}<div class="note" id="shopNote"></div></div>`);
 $('#pt').replaceWith(portrait(look));wire&&wire();shopNote()}
function shopNote(){const n=$('#shopNote');if(n)n.innerHTML=`NT$${S.money} · ${Z('fatigue')} ${S.fat}/${maxFat()} · ${Z('snack')}×${S.bag.snack} · ${Z('drink')}×${S.bag.drink} · ${Z('bubble')}×${S.bag.bubble}`}
function openShop(kind){
 if(kind==='inn')return shop('inn','innHello',{hair:'#3b2a1a',top:'#ff5b4a',trim:'#fff',bottom:'#2b3a66',style:'bun'},
  `<div class="row">${btn('rest','rest','teal','data-autofocus')}<span class="note">${Z('fee')} NT$${innFee()}</span></div>`,()=>{$('#rest').onclick=()=>{
   if(S.fat>=maxFat())return toast(UI.recovered);if(S.money<innFee())return toast(UI.notEnough);S.money-=innFee();S.fat=maxFat();save();hud();shopNote();toast(UI.recovered)}});
 if(kind==='store')return shop('store','storeHello',{hair:'#141210',top:'#14b3a4',trim:'#ff9f2e',bottom:'#2b3a66',style:'short'},
  `<div class="note">${Z('shopDesc')}<br>${T('shopDesc')}</div><div class="row">${buyBtn('snack',50)}${buyBtn('drink',120)}</div>`,()=>wireBuy());
 if(kind==='tea')return shop('tea','teaHello',{hair:'#5a3a22',top:'#d9a066',trim:'#fff',bottom:'#3d4766',style:'pony'},
  `<div class="row">${buyBtn('bubble',70)}</div><div class="note">${rb('珍珠奶茶可以恢復一些疲勞度。')} ${esc(tr(['',"Bubble tea restores some stamina.","タピオカミルクティーでスタミナが少し回復。"]))}</div>`,()=>wireBuy());
 if(kind==='temple')return shop('temple','templeHello',{hair:'#a9a59a',top:'#f2b632',trim:'#c8372d',bottom:'#3d4766',style:'short'},
  `<div class="row">${btn('pray','pray','sun','data-autofocus')}${btn('fort','fortune','alt')}</div><div id="fortOut"></div>`,()=>{
   $('#pray').onclick=()=>{save();toast(UI.saved)};
   $('#fort').onclick=()=>{const f=pick(FORTUNES);if(f[0]==='大吉')S.bag.snack++;if(f[0]==='中吉')S.luck=1;$('#fortOut').innerHTML=`<div class="q"><div class="qprompt">${rb(f[0])}</div><div class="tl">${esc(f[LI()])}</div></div>`;$('#fort').disabled=true;shopNote()}})}
const buyBtn=(k,p)=>`<button class="btn sun" data-buy="${k}" data-p="${p}" ${S.money<p?'disabled':''}>${Z(k)} NT$${p}<span class="tl">${T(k)}</span></button>`;
function wireBuy(){$('#panel').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const p=+b.dataset.p;if(S.money<p)return toast(UI.notEnough);S.money-=p;S.bag[b.dataset.buy]++;hud();shopNote();
 $('#panel').querySelectorAll('[data-buy]').forEach(x=>x.disabled=S.money<+x.dataset.p)})}

/* ---------- 選單 ---------- */
async function mainMenu(){if(mode!=='world')return;const keys=['map','party','bag','badges','dex','save','settings','close'];
 const i=await choice(keys.map(k=>`${Z(k)} <span class="tl" style="display:inline">${T(k)}</span>`),{cls:'start',title:`${esc(S.name)} · Lv ${S.lv}`});
 if(i<0||keys[i]==='close')return;
 if(keys[i]==='save'){save();return say([UI.savedLong])}
 ({map:mapMenu,party:partyMenu,bag:bagMenu,badges:badgeMenu,dex:dexMenu,settings:settingsMenu})[keys[i]]()}
const TW_PTS='73.4,4.5 94.5,18 87.8,36 76.5,63 67.5,94.5 56.3,119 45,139.5 42.8,157.5 36,153 31.5,135 15.8,126 9,108 11.3,85.5 18,63 27,45 45,24.8 54,15.8 67.5,6.8';
function mapMenu(){const open=ci=>ci<=Math.min(S.badges,21);
 let svg=`<svg class="mapsvg" viewBox="-32 -8 134 172" role="img" aria-label="Taiwan map"><rect x="-32" y="-8" width="134" height="172" rx="8" fill="#bfe6ff"/>
 <polygon points="${TW_PTS}" fill="#8bd36b" stroke="#1b2340" stroke-width="1.4"/><path d="M60 40 Q66 70 58 100 Q52 118 48 130" fill="none" stroke="#5fae4c" stroke-width="5" stroke-linecap="round" opacity=".6"/>
 <g fill="#8bd36b" stroke="#1b2340" stroke-width=".8"><circle cx="-14" cy="84" r="3"/><circle cx="-10" cy="88" r="2"/><circle cx="-17" cy="89" r="1.6"/></g>
 <g fill="none" stroke="#1b2340" stroke-width=".6" stroke-dasharray="2 1.5"><rect x="-29" y="-4" width="26" height="22" rx="3"/><rect x="-29" y="34" width="26" height="22" rx="3"/></g>
 <g fill="#8bd36b" stroke="#1b2340" stroke-width=".8"><ellipse cx="-16" cy="7" rx="4" ry="2.5"/><ellipse cx="-11" cy="3" rx="2" ry="1.5"/><path d="M-24 44 Q-18 38 -10 42 Q-8 48 -16 49 Q-22 50 -24 44Z"/></g>
 <polyline points="${CITIES.map(c=>c.x+','+c.y).join(' ')}" fill="none" stroke="#ff5b4a" stroke-width="1" stroke-dasharray="2.5 2" opacity=".8"/>`;
 CITIES.forEach((c,i)=>{const got=S.badges>i,here=i===S.city,u=open(i);svg+=`<g><circle cx="${c.x}" cy="${c.y}" r="${here?4.6:3.6}" fill="${got?'#ff5b4a':u?'#ffffff':'#c9cfdd'}" stroke="${here?'#ffc93c':'#1b2340'}" stroke-width="${here?1.8:1}"/><text x="${c.x}" y="${c.y+1.4}" font-size="3.6" font-weight="800" text-anchor="middle" fill="${got?'#fff':'#1b2340'}" font-family="sans-serif">${i+1}</text></g>`});
 svg+=`<g transform="translate(78 4)"><path d="M0 -4 L3 2 L-3 2Z" fill="${S.badges>=22?'#ffc93c':'#c9cfdd'}" stroke="#1b2340" stroke-width=".6"/></g></svg>`;
 const list=CITIES.map((c,i)=>`<button data-ci="${i}" ${open(i)?'':'disabled'} class="${i===S.city?'here':''} ${S.badges>i?'got':''}"><span class="n">${i+1}</span><span>${rb(c.zh)}<span class="tl">${esc(LI()===2?c.ja:c.en)}</span></span></button>`).join('');
 const lg2=LEAGUE.map((L,t)=>`<button data-lg="${t}" ${S.badges>=22&&t<=S.league?'':'disabled'} class="${t<S.league?'got':''}"><span class="n">${t+1}</span><span>${rb(L.zh)}<span class="tl">${esc(tr(['',L.en,L.ja]))}</span></span></button>`).join('');
 openPanel(head('map',backBtn())+`<div class="pbody"><div class="mapwrap"><div>${svg}</div><div>
  <div class="note">${rb('拿到徽章的城市之間可以自由來去。')} ${esc(tr(['',"Travel freely between any cities you have unlocked.","開放した町の間は自由に移動できます。"]))}</div><div class="clist" style="margin-top:8px">${list}</div>
  <div class="note" style="margin-top:12px">${Z('league')} · ${esc(tr(['',"Six tiers, matching TOCFL","6段階、TOCFLに対応"]))} ${S.badges<22?'· '+T('needAll'):''}</div><div class="clist" style="margin-top:6px">${lg2}</div></div></div></div>`);wireBack();
 $('#panel').querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>travel(+b.dataset.ci,'inn'));
 $('#panel').querySelectorAll('[data-lg]').forEach(b=>b.onclick=()=>leagueTier(+b.dataset.lg))}
function partyMenu(){const pets=S.pets||[];
 const card=(p,i)=>{const a=ANIMALS.find(x=>x.id===p.sp);const need=petNeed(p.lv);return`<div class="tile pet"><span data-an="${a.id}"></span><div style="flex:1;min-width:0">
  <div class="t">${rb(petName(p))} <span class="lv">Lv ${p.lv}</span></div><div class="d">${rb(a.zh)} · ${esc(tr(['',a.en,a.ja]))}</div>
  <div class="bar xp" style="margin:4px 0"><i style="width:${Math.round(100*p.xp/need)}%"></i></div><div class="d">EXP ${p.xp}/${need} · ${esc(tr(['',...a.ab]))}</div>
  <div class="row" style="margin-top:6px"><button class="btn sun" data-feed="${i}">${Z('feed')} <span class="tl">×${S.bag.snack}</span></button><button class="btn alt" data-ren="${i}">${Z('rename')}</button></div><div data-renbox="${i}"></div></div></div>`};
 const unseen=ANIMALS.filter(a=>!has(a.id)).map(a=>`<div class="tile dim"><span data-an="${a.id}" data-dim="1"></span><div><div class="t">？？？</div><div class="d">${a.minCity>0?rb(CITIES[a.minCity].zh)+'+':''}</div></div></div>`).join('');
 openPanel(head('party',backBtn())+`<div class="pbody"><div class="note">${rb('用寵物零食餵牠，牠就會累積經驗、提升等級，能力也會變強。')}<br>${esc(tr(['',"Feed pet treats to give your companions EXP. As they level up, their abilities get stronger.","おやつをあげると仲間に経験値が入り、レベルが上がると能力も強くなります。"]))}</div>
 <div class="grid">${pets.map(card).join('')||`<div class="note">${rb('還沒有夥伴。')}</div>`}</div>${unseen?`<div class="grid">${unseen}</div>`:''}</div>`);wireBack();
 $('#panel').querySelectorAll('[data-an]').forEach(s=>{const id=s.dataset.an;const c=document.createElement('canvas');c.width=120;c.height=120;c.style.cssText='width:60px;height:60px;flex:none'+(s.dataset.dim?';filter:brightness(0) opacity(.25)':'');drawAnimal(c.getContext('2d'),id,60,112,92);s.replaceWith(c)});
 $('#panel').querySelectorAll('[data-feed]').forEach(b=>b.onclick=()=>{const p=pets[+b.dataset.feed];if(S.bag.snack<1)return toast(UI.noTreat);S.bag.snack--;p.xp+=15;let up=false;while(p.xp>=petNeed(p.lv)){p.xp-=petNeed(p.lv);p.lv++;up=true}
  if(up)toast([`${petName(p)}升到Lv ${p.lv}了！`,`${petName(p)} grew to Lv ${p.lv}!`,`${petName(p)}はLv ${p.lv}になった！`]);else toast(UI.petFed);save();hud();partyMenu()});
 $('#panel').querySelectorAll('[data-ren]').forEach(b=>b.onclick=()=>{const i=+b.dataset.ren,box=$(`[data-renbox="${i}"]`);box.innerHTML=`<div class="row" style="margin-top:6px"><input type="text" maxlength="8" value="${esc(pets[i].nick)}" style="flex:1;min-width:0"><button class="btn teal">${Z('ok')}</button></div>`;
  const inp=box.querySelector('input');inp.focus();const ok=()=>{pets[i].nick=inp.value.trim().slice(0,8);save();partyMenu()};box.querySelector('button').onclick=ok;inp.onkeydown=e=>{if(e.key==='Enter')ok()}})}
function bagMenu(){const row=(k,desc,usable)=>`<div class="tile"><div style="flex:1;min-width:0"><div class="t">${Z(k)} ×${S.bag[k]}</div><div class="d">${T(k)} · ${esc(desc)}</div></div>${usable?`<button class="btn teal" data-use="${k}" ${S.bag[k]<1?'disabled':''}>${Z('use')}</button>`:''}</div>`;
 openPanel(head('bag',backBtn())+`<div class="pbody"><div class="grid">${row('snack',tr(['',"Tames wild animals; feed it to companions in the Companions menu","野生の動物を仲間にしたり、仲間にあげたりできる"]),false)}${row('drink',tr(['',"Restores 50% stamina","スタミナを50%回復"]),true)}${row('bubble',tr(['',"Restores 35% stamina","スタミナを35%回復"]),true)}</div><div class="note">${Z('fatigue')} ${S.fat}/${maxFat()} · NT$${S.money}</div></div>`);wireBack();
 $('#panel').querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{const k=b.dataset.use;if(S.bag[k]<1)return;S.bag[k]--;S.fat=Math.min(maxFat(),S.fat+Math.round(maxFat()*(k==='drink'?.5:.35)));hud();toast(UI.recovered);bagMenu()})}
function badgeMenu(){openPanel(head('badges',backBtn())+`<div class="pbody"><div class="badges">${CITIES.map((c,i)=>`<div class="badge">${badgeSVG(i,S.badges>i)}<span>${rb(c.zh)}</span><span class="tl">${S.badges>i?esc(c.leader):''}</span></div>`).join('')}</div>
 <div class="note">${Z('league')} ${S.league}/6 ${S.champion?'· '+Z('champion'):''}</div></div>`);wireBack()}
function dexMenu(){const n=Object.keys(S.seen).length;openPanel(head('dex',backBtn())+`<div class="pbody"><div class="note">${n}/${ALLV.length} ${T('words')} · ${esc(tr(['',"Words you meet in battle are recorded here (correct / seen).","バトルで出会った単語がここに記録されます（正解数／出会った数）。"]))}</div>
 <div class="dex">${ALLV.map(v=>{const s=S.seen[v.w];return s?`<div>${rb(v.w)}<small>${esc(itemTr(v))} · ${s.ok}/${s.n}</small></div>`:`<div class="unk">？？？<small>&nbsp;</small></div>`}).join('')}</div></div>`);wireBack()}
function settingsMenu(){const st=S.settings;
 const vs=twVoices.map(v=>`<option value="${esc(v.voiceURI)}" ${v.voiceURI===st.voice?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
 openPanel(head('settings',backBtn())+`<div class="pbody">
 <div class="field">${Z('ruby')} <span class="tl">${T('ruby')}</span><span class="seg">${['pinyin','zhuyin','off'].map(k=>`<button data-ruby="${k}" aria-pressed="${st.ruby===k}">${Z(k)}</button>`).join('')}</span></div>
 <div class="field">${Z('lang')} <span class="tl">${T('lang')}</span><span class="seg"><button data-lang="en" aria-pressed="${st.lang==='en'}">English</button><button data-lang="ja" aria-pressed="${st.lang==='ja'}">日本語</button></span></div>
 <label class="field" for="voiceSel">${Z('voice')} <span class="tl">${T('voice')}</span>${vs?`<select id="voiceSel">${vs}</select>`:`<span class="note">${Z('noVoice')}<br>${T('noVoice')}</span>`}</label>
 <label class="field" for="rateSel">${Z('speed')} <span class="tl">${T('speed')}</span><select id="rateSel">${[.7,.8,.9,1].map(v=>`<option value="${v}" ${st.rate==v?'selected':''}>${v}×</option>`).join('')}</select></label>
 ${vs?`<div class="row"><button class="btn alt" id="testV">▶ ${rb('你好，歡迎來到臺灣！')}</button></div>`:''}
 <div class="row">${btn('resetBtn','reset','alt')}<span class="note" id="resetNote"></span></div></div>`);wireBack();
 $('#panel').querySelectorAll('[data-ruby]').forEach(b=>b.onclick=()=>{st.ruby=b.dataset.ruby;save();rebuild();hud();settingsMenu()});
 $('#panel').querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{st.lang=b.dataset.lang;save();hud();settingsMenu()});
 const v=$('#voiceSel');if(v)v.onchange=()=>{st.voice=v.value;save()};$('#rateSel').onchange=e=>{st.rate=+e.target.value;save()};
 const tv=$('#testV');if(tv)tv.onclick=()=>speak('你好，歡迎來到臺灣！');
 let armed=false;$('#resetBtn').onclick=()=>{if(!armed){armed=true;$('#resetNote').textContent=tr(['',"Tap again to erase all progress.","もう一度押すと進行状況が消えます。"]);return}try{localStorage.removeItem(KEY)}catch(e){}$('#ov').hidden=true;$('#hud').hidden=true;bootBackdrop();titleScreen()}}

/* ---------- 標題 ---------- */
let titleLang=(navigator.language||'').toLowerCase().startsWith('ja')?'ja':'en',titleRuby='pinyin';
let titleTouched=false,titleGender='m';
function titleScreen(){mode='title';const saved=load();if(saved&&saved.settings&&!titleTouched){titleLang=saved.settings.lang||titleLang;titleRuby=saved.settings.ruby||titleRuby}const tmp={settings:{ruby:titleRuby,lang:titleLang}};const keep=S;S=tmp;
 const html=`<div class="title"><div class="eyebrow">TAIWAN MANDARIN</div><h1>${rb('臺灣華語')}</h1>
  <p>${esc(tr(['',"Start in Taoyuan and circle Taiwan counterclockwise. Beat 22 language gyms, battle trainers, and befriend animals along the way.","桃園から反時計回りに台湾を一周。22の言語ジムに挑み、トレーナーと勝負し、動物と仲よくなろう。"]))}</p>
  <div class="row" style="justify-content:center"><span class="seg"><button data-tl="en" aria-pressed="${titleLang==='en'}">English</button><button data-tl="ja" aria-pressed="${titleLang==='ja'}">日本語</button></span>
  <span class="seg">${['pinyin','zhuyin','off'].map(k=>`<button data-tr="${k}" aria-pressed="${titleRuby===k}">${Z(k)}</button>`).join('')}</span></div>
  <div class="row" style="justify-content:center;align-items:center"><span class="nmlbl" style="font-weight:800">${Z('gender')} <span class="tl" style="display:inline">${T('gender')}</span></span><span class="seg">${['m','f'].map(k=>`<button data-gd="${k}" aria-pressed="${titleGender===k}">${Z(k==='m'?'boy':'girl')} <span class="tl" style="display:inline">${T(k==='m'?'boy':'girl')}</span></button>`).join('')}</span><canvas id="gdPrev" width="120" height="150" style="width:60px;height:75px"></canvas></div>
  ${saved?`<button class="btn sun" id="cont" data-autofocus>${Z('cont')}<span class="tl">${T('cont')} · ${esc(saved.name)} Lv ${saved.lv} · ★${saved.badges}</span></button>`:''}
  <label class="field inline" for="nameIn"><span class="nmlbl">${Z('name')}<span class="tl">${T('name')}</span></span><input type="text" id="nameIn" maxlength="10" value="${saved?esc(saved.name):'旅人'}" autocomplete="off"></label>
  <button class="btn" id="newG" ${saved?'':'data-autofocus'}>${Z('newGame')}<span class="tl">${T('newGame')}</span></button></div>`;
 S=keep;$('#panel').innerHTML='';$('#ov').hidden=false;$('#panel').outerHTML;const p=$('#panel');p.style.cssText='background:none;border:none;box-shadow:none;display:flex;justify-content:center';p.innerHTML=html;
 p.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{titleTouched=true;titleLang=b.dataset.tl;titleScreen()});p.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{titleTouched=true;titleRuby=b.dataset.tr;titleScreen()});
 p.querySelectorAll('[data-gd]').forEach(b=>b.onclick=()=>{titleGender=b.dataset.gd;titleScreen()});{const gc=$('#gdPrev');if(gc){const keep2=S;S={gender:titleGender};drawChar(gc.getContext('2d'),60,146,110,playerLook(),'down',0);S=keep2}}
 const c=$('#cont');if(c)c.onclick=()=>{restore(saved);begin(false)};
 $('#newG').onclick=()=>{S=fresh(($('#nameIn').value||'旅人').trim().slice(0,10));S.settings.lang=titleLang;S.settings.ruby=titleRuby;S.gender=titleGender;$('#ov').hidden=true;$('#panel').innerHTML='';if(skipFly)begin(true);else flight(()=>begin(true))}}
function restore(saved){S=Object.assign(fresh(saved.name),saved);migrate();S.settings=Object.assign(fresh('').settings,saved.settings||{},{lang:titleLang,ruby:titleRuby});S.bag=Object.assign({snack:0,drink:0,bubble:0},saved.bag||{})}
let skipFly=false;
function begin(isNew){migrate();const p=$('#panel');p.style.cssText='';p.innerHTML='';$('#ov').hidden=true;
 MAP=genMap(S.city);ground=null;sprites={};S.fat=clamp(S.fat,0,maxFat());fit();rebuild();hud();mode='world';showCityTag();save();
 if(isNew){S.fat=maxFat();dialog(INTRO,null,'林老師')}}
// 標題畫面背景：先畫一座城鎮
function bootBackdrop(){S={settings:{ruby:titleRuby,lang:titleLang},x:11,y:10,dir:'down',city:0,beaten:{},pets:[]};MAP=genMap(0);fit();rebuild();const keep=S;return keep}

/* ---------- 開場：從國外搭飛機到桃園機場 ---------- */
function planeTop(g,x,y,s,ang){g.save();g.translate(x,y);g.rotate(ang);const lw=Math.max(1.5,s*.05);
 g.save();g.translate(s*.25,s*.45);g.globalAlpha=.25;g.fillStyle='#0b2a4a';ell(g,0,0,s*1,s*.2);g.fill();g.beginPath();g.moveTo(-s*.1,0);g.lineTo(-s*.5,-s*.9);g.lineTo(-s*.25,-s*.9);g.lineTo(s*.3,0);g.lineTo(-s*.25,s*.9);g.lineTo(-s*.5,s*.9);g.closePath();g.fill();g.restore();
 g.beginPath();g.moveTo(-s*.1,0);g.lineTo(-s*.5,-s*.9);g.lineTo(-s*.25,-s*.9);g.lineTo(s*.3,0);g.lineTo(-s*.25,s*.9);g.lineTo(-s*.5,s*.9);g.closePath();fs(g,'#dfe6f2',lw);
 g.beginPath();g.moveTo(-s*.75,0);g.lineTo(-s*.95,-s*.35);g.lineTo(-s*.82,-s*.35);g.lineTo(-s*.6,0);g.lineTo(-s*.82,s*.35);g.lineTo(-s*.95,s*.35);g.closePath();fs(g,'#ff5b4a',lw);
 ell(g,0,0,s,s*.17);fs(g,'#ffffff',lw);ell(g,s*.72,0,s*.12,s*.08);g.fillStyle='#1b2340';g.fill();
 [[-.2,-.55],[-.2,.55]].forEach(([a,b])=>{ell(g,a*s,b*s,s*.13,s*.06);fs(g,'#9aa4b8',lw*.8)});g.restore()}
function planeSide(g,x,y,s,pitch,gear){g.save();g.translate(x,y);g.rotate(pitch);const lw=Math.max(1.5,s*.04);
 g.beginPath();g.moveTo(-s*1.25,-s*.1);g.lineTo(-s*1.55,-s*.75);g.lineTo(-s*1.25,-s*.75);g.lineTo(-s*.85,-s*.12);g.closePath();fs(g,'#ff5b4a',lw);
 if(gear){[[-.35],[.75]].forEach(([a])=>{g.strokeStyle=OUT;g.lineWidth=lw;g.beginPath();g.moveTo(a*s,s*.15);g.lineTo(a*s,s*.36);g.stroke();circ(g,a*s,s*.38,s*.08);fs(g,'#2b2d47',lw*.7)})}
 rr(g,-s*1.5,-s*.22,s*3,s*.44,s*.22);fs(g,lg(g,0,-s*.22,0,s*.22,['#ffffff','#dfe6f2']),lw);
 g.fillStyle='#ff5b4a';g.fillRect(-s*1.3,s*.04,s*2.6,s*.06);
 g.fillStyle='#5aa9ff';for(let k=0;k<11;k++){circ(g,-s*.95+k*s*.19,-s*.06,s*.045);g.fill()}
 g.beginPath();g.moveTo(s*1.18,-s*.16);g.quadraticCurveTo(s*1.42,-s*.14,s*1.46,-s*.02);g.lineTo(s*1.2,-s*.02);g.closePath();fs(g,'#1b2340',lw*.6);
 g.beginPath();g.moveTo(-s*.35,s*.05);g.lineTo(s*.35,s*.05);g.lineTo(-s*.15,s*.32);g.lineTo(-s*.55,s*.32);g.closePath();fs(g,'#c7cfdf',lw);
 ell(g,s*.0,s*.3,s*.28,s*.1);fs(g,'#9aa4b8',lw);
 g.beginPath();g.moveTo(-s*1.2,-s*.02);g.lineTo(-s*1.6,-s*.08);g.lineTo(-s*1.55,s*.04);g.lineTo(-s*1.15,s*.06);g.closePath();fs(g,'#ff5b4a',lw*.8);
 g.restore()}
function cloudsDraw(g,w,h,cl,t,yMax){cl.forEach(c=>{const x=((c.x+t*c.v)%1.3-.15)*w,y=c.y*h*yMax,s=c.s*Math.min(w,h)*.08;g.fillStyle='rgba(255,255,255,.85)';[[0,0,1],[s*.9,s*.1,.8],[-s*.9,s*.15,.75],[s*.3,-s*.4,.7]].forEach(([dx,dy,k])=>{ell(g,x+dx,y+dy,s*k,s*k*.7);g.fill()})})}
function mapScene(g,w,h,p,cl,t){g.fillStyle=lg(g,0,0,w,h,['#1f6fbf','#4aa8ea']);g.fillRect(0,0,w,h);
 g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=2;for(let y=h*.1;y<h;y+=h*.08){g.beginPath();for(let x=0;x<=w;x+=20)g.lineTo(x,y+Math.sin(x*.02+t/600+y)*4);g.stroke()}
 g.beginPath();g.moveTo(0,h*.05);g.quadraticCurveTo(w*.12,h*.12,w*.1,h*.32);g.quadraticCurveTo(w*.16,h*.45,0,h*.55);g.closePath();fs(g,'#7fbf6a',2);
 const k=Math.min(h*.62/160,w*.5/95),ox=w-95*k-w*.06,oy=h*.17;
 g.beginPath();TW_PTS.split(' ').forEach((pt,i)=>{const[a,b]=pt.split(',').map(Number);i?g.lineTo(ox+a*k,oy+b*k):g.moveTo(ox+a*k,oy+b*k)});g.closePath();fs(g,'#8bd36b',2.5);
 g.beginPath();g.moveTo(ox+60*k,oy+40*k);g.quadraticCurveTo(ox+66*k,oy+70*k,ox+50*k,oy+125*k);g.strokeStyle='rgba(60,140,60,.6)';g.lineWidth=k*6;g.lineCap='round';g.stroke();
 const tx=ox+63*k,ty=oy+18.5*k,pr=(t/500)%1;circ(g,tx,ty,6+pr*20);g.strokeStyle=`rgba(255,91,74,${1-pr})`;g.lineWidth=3;g.stroke();circ(g,tx,ty,6);fs(g,'#ff5b4a',2);
 {const fz=Math.max(16,Math.min(26,w*.04));canvasRuby(g,'桃園',tx-fz*1.6,ty+fz*1.9,fz,'#ffffff','#1b2340')}
 const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,P=t2=>{const a=[-w*.08,h*.82],c=[w*.35,h*.02],b=[tx,ty];const u=1-t2;return[u*u*a[0]+2*u*t2*c[0]+t2*t2*b[0],u*u*a[1]+2*u*t2*c[1]+t2*t2*b[1]]};
 g.setLineDash([8,8]);g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=3;g.beginPath();for(let q=0;q<=e;q+=.01){const[x,y]=P(q);q?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();g.setLineDash([]);
 const[x,y]=P(e),[x2,y2]=P(Math.min(1,e+.01));planeTop(g,x,y,Math.min(w,h)*.06*(1-.35*e),Math.atan2(y2-y,x2-x)||0);
 g.globalAlpha=.55;cloudsDraw(g,w,h,cl.slice(0,6),t/1000,.9);g.globalAlpha=1}
function landScene(g,w,h,p,cl,t){g.fillStyle=lg(g,0,0,0,h,['#7cc6ff','#cfeeff','#ffe9c7']);g.fillRect(0,0,w,h);
 circ(g,w*.82,h*.2,Math.min(w,h)*.07);g.fillStyle='#fff3b0';g.fill();cloudsDraw(g,w,h,cl,t/1000,.45);
 [['#a9d9a0',.62,.07],['#7fbf6a',.68,.05]].forEach(([col,base,amp],i)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=w/12)g.lineTo(x,h*base-Math.abs(Math.sin(x*.006+i*2))*h*amp*2);g.lineTo(w,h);g.fill()});
 const ry=h*.82;g.fillStyle='#8bd36b';g.fillRect(0,h*.72,w,h*.28);
 const bx=w*.55,bw=Math.min(w*.42,520),bh=Math.min(h*.12,bw*.35);rr(g,bx,h*.72-bh,bw,bh,8);fs(g,lg(g,0,h*.6,0,h*.72,['#d6f0ff','#8fc3e8']),2);
 g.beginPath();g.moveTo(bx-10,h*.72-bh);g.quadraticCurveTo(bx+bw/2,h*.72-bh*1.6,bx+bw+10,h*.72-bh);g.closePath();fs(g,'#eef2f8',2);
 g.strokeStyle='rgba(27,35,64,.25)';g.lineWidth=1;for(let x=bx+bw/10;x<bx+bw;x+=bw/10){g.beginPath();g.moveTo(x,h*.72-bh);g.lineTo(x,h*.72);g.stroke()}
 const tw=bx-w*.06;rr(g,tw,h*.72-bh*2.2,bh*.3,bh*2.2,4);fs(g,'#eef2f8',2);rr(g,tw-bh*.15,h*.72-bh*2.5,bh*.6,bh*.4,6);fs(g,'#5aa9ff',2);
 canvasRuby(g,'桃園機場',bx+bw/2,h*.72-bh*.35,Math.max(14,Math.min(26,bw*.07)),'#1b2340','#ffffff');
 g.fillStyle='#5b6178';g.fillRect(0,ry-h*.03,w,h*.07);g.fillStyle='#fff';const roll=p<.55?0:Math.min(1,(p-.55)/.3);
 for(let x=-((roll*200)%60);x<w;x+=60)g.fillRect(x,ry+h*.003,30,h*.006);
 for(let x=10;x<w;x+=40){circ(g,x,ry-h*.033,2.5);g.fillStyle='#ffd35a';g.fill();g.fillStyle='#fff'}
 const s=Math.min(w*.14,h*.1);let x,y,pitch=0;
 if(p<.55){const q=p/.55,e=1-Math.pow(1-q,2);x=-w*.2+(w*.5)*e;y=h*.2+(ry-s*.4-h*.2)*Math.pow(q,1.3);pitch=-.06*q+.14*(1-q)}
 else{const q=Math.min(1,(p-.55)/.3);x=w*.3+w*.2*(1-Math.pow(1-q,2));y=ry-s*.4;pitch=0;
  if(q<.4){const a=1-q/.4;g.fillStyle=`rgba(255,255,255,${a*.8})`;[0,1,2].forEach(i=>{ell(g,w*.3-i*s*.4-q*40,ry,s*.25*(1+q*2),s*.12*(1+q));g.fill()})}}
 planeSide(g,x,y,s,pitch,p>.25);
 if(p>.86){const q=(p-.86)/.14;const px=x+s*.9+q*s*1.6;drawChar(g,px,ry+s*.05,s*.75,playerLook(),'right',Math.floor(t/150)%2?1:-1)}}
function flight(done){const ov=document.createElement('div');ov.className='fly';
 ov.innerHTML=`<canvas></canvas><div class="card flycap" id="flyCap"></div><button class="hbtn" id="flySkip">${Z('skip')} <span class="tl" style="display:inline">${T('skip')}</span></button>`;document.body.appendChild(ov);
 const c=ov.querySelector('canvas'),g=c.getContext('2d'),t0=performance.now(),DUR=8200,M=3800;let end=false,cs=-1;
 const cl=Array.from({length:10},()=>({x:Math.random(),y:Math.random(),s:.5+Math.random(),v:.03+Math.random()*.05}));
 const finish=()=>{if(end)return;end=true;ov.style.opacity=0;setTimeout(()=>{ov.remove();done()},450)};
 ov.querySelector('#flySkip').onclick=finish;ov.querySelector('#flySkip').focus();
 const caps=[['從國外飛往臺灣……',"Flying to Taiwan from abroad…","海外から台湾へ向かっています……"],['歡迎來到桃園國際機場！',"Welcome to Taoyuan International Airport!","桃園国際空港へようこそ！"]];
 const frame=now=>{if(end)return;const t=Math.max(0,now-t0),w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);
  if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d)}g.setTransform(d,0,0,d,0,0);
  if(t<M)mapScene(g,w,h,t/M,cl,t);else landScene(g,w,h,Math.min(1,(t-M)/(DUR-M-600)),cl,t);
  const st=t<M?0:1;if(st!==cs){cs=st;$('#flyCap').innerHTML=`${rb(caps[st][0])}<span class="tl">${esc(caps[st][LI()])}</span>`}
  if(t>=DUR)return finish();requestAnimationFrame(frame)};requestAnimationFrame(frame)}

/* ---------- 有存檔：下飛機後詢問，搭計程車回到存檔位置 ---------- */
function askResume(sv){const c=CITIES[sv.city]||CITIES[0];const p=$('#panel');p.style.cssText='background:none;border:none;box-shadow:none;display:flex;justify-content:center';$('#ov').hidden=false;mode='title';
 const L=[`歡迎回來，${sv.name}！要搭計程車到上次存檔的地方嗎？`,`Welcome back, ${sv.name}! Take a taxi to where you last saved?`,`おかえり、${sv.name}！前回セーブした場所までタクシーで行く？`];
 p.innerHTML=`<div class="title"><div class="eyebrow">TAIWAN MANDARIN</div><div class="qprompt sm">${rb(L[0])}</div><div class="tl">${esc(L[LI()])}</div>
  <div class="row" style="justify-content:center;gap:14px"><div style="width:72px">${badgeSVG(Math.max(0,sv.badges-1),sv.badges>0)}</div><div style="text-align:left"><div style="font-weight:900;font-size:20px;font-family:var(--f-zh);line-height:2">${rb(c.zh)}</div><div class="note">${esc(LI()===2?c.ja:c.en)} · ${esc(sv.name)} Lv ${sv.lv} · ★ ${sv.badges}/22</div></div></div>
  <div class="row" style="justify-content:center"><button class="btn sun" id="rYes">${rb('好，出發！')}<span class="tl">${esc(tr(['',"Yes, let's go","はい、行こう"]))}</span></button><button class="btn alt" id="rNo">${rb('不用，回到標題')}<span class="tl">${esc(tr(['',"No, back to the title","いいえ、タイトルへ"]))}</span></button></div></div>`;
 $('#rYes').focus();
 $('#rYes').onclick=()=>{restore(sv);$('#ov').hidden=true;p.innerHTML='';p.style.cssText='';travelAnim(S.city,()=>begin(false))};
 $('#rNo').onclick=()=>{skipFly=true;titleScreen()}}
function taxiDraw(g,x,y,s,t){const lw=Math.max(1.5,s*.018),bob=Math.sin(t/90)*s*.008;g.save();g.translate(x,y+bob);
 ell(g,0,s*.02,s*.5,s*.05);g.fillStyle='rgba(0,0,0,.25)';g.fill();
 g.beginPath();g.moveTo(-s*.28,-s*.2);g.quadraticCurveTo(-s*.22,-s*.36,-s*.1,-s*.37);g.lineTo(s*.12,-s*.37);g.quadraticCurveTo(s*.22,-s*.36,s*.3,-s*.2);g.closePath();fs(g,'#ffcc1a',lw);
 rr(g,-s*.48,-s*.22,s*.98,s*.2,s*.07);fs(g,lg(g,0,-s*.22,0,0,['#ffd94a','#f2b400']),lw);
 [[-s*.22,-s*.33,s*.15],[-s*.03,-s*.33,s*.16]].forEach(([wx,wy,ww])=>{rr(g,wx,wy,ww,s*.12,s*.03);fs(g,'#bfe8ff',lw*.8)});
 g.beginPath();g.moveTo(s*.16,-s*.33);g.lineTo(s*.27,-s*.21);g.lineTo(s*.16,-s*.21);g.closePath();fs(g,'#bfe8ff',lw*.8);
 circ(g,s*.06,-s*.26,s*.035);fs(g,'#ffd9b8',lw*.6);circ(g,s*.06,-s*.28,s*.035);g.fillStyle='#20201f';g.beginPath();g.arc(s*.06,-s*.27,s*.037,Math.PI,0);g.fill();
 circ(g,-s*.14,-s*.25,s*.035);fs(g,'#ffd9b8',lw*.6);g.beginPath();g.arc(-s*.14,-s*.27,s*.04,Math.PI,0);g.closePath();fs(g,'#ff5b4a',lw*.5);
 rr(g,-s*.1,-s*.45,s*.2,s*.08,s*.02);fs(g,'#ffffff',lw*.8);g.fillStyle='#1b2340';g.font=`900 ${s*.06}px sans-serif`;g.textAlign='center';g.fillText('TAXI',0,-s*.39);
 g.fillStyle='#1b2340';g.fillRect(-s*.46,-s*.12,s*.94,s*.025);
 ell(g,s*.47,-s*.14,s*.03,s*.025);g.fillStyle='#fff8c0';g.fill();g.fillStyle='rgba(255,248,192,.35)';g.beginPath();g.moveTo(s*.5,-s*.14);g.lineTo(s*.8,-s*.2);g.lineTo(s*.8,-s*.06);g.fill();
 ell(g,-s*.47,-s*.14,s*.025,s*.025);g.fillStyle='#ff4a3a';g.fill();
 [-s*.28,s*.3].forEach(wx=>{circ(g,wx,-s*.01,s*.085);fs(g,'#2b2d47',lw);circ(g,wx,-s*.01,s*.04);fs(g,'#c7cfdf',lw*.6);
  g.save();g.translate(wx,-s*.01);g.rotate(t/80);g.strokeStyle='#5b6178';g.lineWidth=lw;for(let k=0;k<3;k++){g.rotate(Math.PI*2/3);g.beginPath();g.moveTo(0,0);g.lineTo(s*.04,0);g.stroke()}g.restore()});
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=lw*1.2;g.lineCap='round';[0,1,2].forEach(k=>{const yy=-s*(.08+k*.07),ll=s*(.12+((t/60+k*7)%10)*.01);g.beginPath();g.moveTo(-s*.58,yy);g.lineTo(-s*.58-ll,yy);g.stroke()});
 g.restore()}
function taxiScene(g,w,h,p,t,city){g.fillStyle=lg(g,0,0,0,h,['#86c8ff','#dff3ff']);g.fillRect(0,0,w,h);circ(g,w*.85,h*.16,Math.min(w,h)*.06);g.fillStyle='#fff3b0';g.fill();
 const gy=h*.66;g.fillStyle='#a9d9a0';g.beginPath();g.moveTo(0,gy);for(let x=0;x<=w+40;x+=40){const X=x-((t*.03)%40);g.lineTo(X,gy-h*.18-Math.abs(Math.sin((X+t*.03)*.004))*h*.12)}g.lineTo(w,gy);g.fill();
 const BW=Math.max(70,w*.12),off=t*.18,i0=Math.floor(off/BW)-1,cols=['#f3efe6','#fbe3c3','#dfe7f2','#f6d4cf','#e5f0d8'];
 for(let i=i0;i<i0+Math.ceil(w/BW)+3;i++){const x=i*BW-off,hs=Math.abs(Math.sin(i*12.9898)*43758.5453)%1,bh=h*(.14+hs*.2),bw2=BW*.86;
  rr(g,x,gy-bh,bw2,bh,3);fs(g,cols[Math.floor(hs*5)],2);g.fillStyle='#8fc7e8';for(let r=0;r<Math.floor(bh/(h*.05));r++)for(let c=0;c<3;c++)g.fillRect(x+bw2*(.12+c*.29),gy-bh+h*.015+r*h*.05,bw2*.18,h*.025);
  if(hs>.5){rr(g,x+bw2*.15,gy-bh-h*.03,bw2*.3,h*.03,6);fs(g,'#c7cfdf',1.5)}}
 g.fillStyle='#d6d0c4';g.fillRect(0,gy,w,h*.04);g.fillStyle='#5b6178';g.fillRect(0,gy+h*.04,w,h*.2);g.fillStyle='#8bd36b';g.fillRect(0,gy+h*.24,w,h);
 g.fillStyle='#fff';const o2=(t*.5)%80;for(let x=-o2;x<w;x+=80)g.fillRect(x,gy+h*.135,40,h*.008);
 const o3=(t*.5)%260;for(let x=-o3;x<w+260;x+=260){g.fillStyle='#3d4766';g.fillRect(x,gy-h*.16,4,h*.16);rr(g,x-8,gy-h*.17,20,8,4);fs(g,'#fff1b8',1.5)}
 if(p>.3&&p<.85){const q=(p-.3)/.55,sx=w*1.05-q*(w*1.5),sw=Math.min(w*.4,260),sh=sw*.42;g.fillStyle='#3d4766';g.fillRect(sx+sw*.15,gy-h*.05-sh-h*.05,5,sh+h*.1);g.fillRect(sx+sw*.8,gy-h*.05-sh-h*.05,5,sh+h*.1);
  rr(g,sx,gy-h*.05-sh-h*.12,sw,sh,8);fs(g,'#1f8a4c',2.5);canvasRuby(g,city.zh,sx+sw*.42,gy-h*.17-sh*.25,Math.min(sh*.34,30),'#ffffff');
  g.fillStyle='#fff';g.font=`900 ${sh*.3}px sans-serif`;g.textAlign='center';g.fillText('→',sx+sw*.85,gy-h*.17-sh*.25)}
 const s=Math.min(w*.42,h*.42);taxiDraw(g,w*.45,gy+h*.16,s,t)}
function skyScene(g,w,h,p,t,cl){g.fillStyle=lg(g,0,0,0,h,['#6fb8ff','#d8f0ff']);g.fillRect(0,0,w,h);cloudsDraw(g,w,h,cl,t/600,1);
 g.fillStyle='#2f86d6';g.fillRect(0,h*.82,w,h*.18);const s=Math.min(w*.18,h*.12);planeSide(g,w*.45,h*.42+Math.sin(t/400)*h*.02,s,-.03,false)}
function travelAnim(ci,done){const city=CITIES[ci],island=!!city.island;const ov=document.createElement('div');ov.className='fly';
 ov.innerHTML=`<canvas></canvas><div class="card flycap" id="flyCap"></div><button class="hbtn" id="flySkip">${Z('skip')} <span class="tl" style="display:inline">${T('skip')}</span></button>`;document.body.appendChild(ov);
 const cap=island?[`先搭計程車，再坐${city.id==='penghu'?'船':'飛機'}前往${city.zh}……`,`Taxi, then ${city.id==='penghu'?'a ferry':'a flight'} to ${city.en}…`,`タクシーと${city.id==='penghu'?'フェリー':'飛行機'}で${city.ja}へ……`]:[`搭計程車前往${city.zh}……`,`Taking a taxi to ${city.en}…`,`タクシーで${city.ja}へ……`];
 $('#flyCap').innerHTML=`${rb(cap[0])}<span class="tl">${esc(cap[LI()])}</span>`;
 const c=ov.querySelector('canvas'),g=c.getContext('2d'),t0=performance.now(),DUR=6200;let end=false;const cl=Array.from({length:10},()=>({x:Math.random(),y:Math.random()*.7,s:.5+Math.random(),v:.03+Math.random()*.05}));
 const finish=()=>{if(end)return;end=true;ov.style.opacity=0;setTimeout(()=>{ov.remove();done()},450)};ov.querySelector('#flySkip').onclick=finish;ov.querySelector('#flySkip').focus();
 const frame=now=>{if(end)return;const t=Math.max(0,now-t0),w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);
  if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d)}g.setTransform(d,0,0,d,0,0);const p=Math.min(1,t/DUR);
  if(island&&p>.5)skyScene(g,w,h,p,t,cl);else taxiScene(g,w,h,island?p*2*.7:p,t,city);
  rr(g,w*.2,h-30-Math.max(0,0),w*.6,10,5);g.fillStyle='rgba(255,255,255,.7)';g.fill();rr(g,w*.2,h-30,w*.6*p,10,5);g.fillStyle='#ff5b4a';g.fill();
  if(t>=DUR)return finish();requestAnimationFrame(frame)};requestAnimationFrame(frame)}

/* ---------- 輸入 ---------- */
const KEYDIR={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
function pressA(){if(mode==='choice'&&CH){const f=document.activeElement;if(f&&CH.box.contains(f))f.click();else CH.box.querySelector('.chi').click();return}if(mode==='dialog'){if(tw)tw.fin();else nextLine()}else if(mode==='world')interact()}
function pressB(){if(mode==='choice'&&CH){CH.cancel();return}if(mode==='world')mainMenu();else if(mode==='menu')closePanel();else if(mode==='dialog'){if(tw)tw.fin();else nextLine()}}
function navFocus(scope,dir,sel){const items=[...scope.querySelectorAll(sel)].filter(b=>!b.disabled&&b.offsetParent);if(!items.length)return;let i=items.indexOf(document.activeElement);
 if(i<0){items[0].focus();return}const cur=items[i].getBoundingClientRect();let best=null,bd=1e9;items.forEach((b,j)=>{if(j===i)return;const r=b.getBoundingClientRect();const dx=(r.left+r.width/2)-(cur.left+cur.width/2),dy=(r.top+r.height/2)-(cur.top+cur.height/2);
  const ok=dir==='up'?dy<-4:dir==='down'?dy>4:dir==='left'?dx<-4:dx>4;if(!ok)return;const d=Math.abs(dx)+Math.abs(dy)*(dir==='left'||dir==='right'?3:1)+(dir==='up'||dir==='down'?Math.abs(dx)*2:0);if(d<bd){bd=d;best=b}});
 if(best)best.focus();else if(dir==='down'||dir==='right')items[(i+1)%items.length].focus();else items[(i-1+items.length)%items.length].focus()}
document.addEventListener('keydown',e=>{const tag=e.target.tagName||'';if(tag==='INPUT'||tag==='SELECT')return;
 if(mode==='choice'&&CH){const d=KEYDIR[e.key];if(d){e.preventDefault();if(CH.adj&&(d==='up'||d==='down')){CH.adj(d==='up'?1:-1);return}if(CH.adj&&(d==='left'||d==='right')){CH.adj(d==='right'?10:-10);return}navFocus(CH.box,d,'.chi');return}
  if(['z','Z',' ','Enter'].includes(e.key)){e.preventDefault();pressA();return}if(['x','X','Escape','Backspace'].includes(e.key)){e.preventDefault();pressB()}return}
 if((mode==='menu'||mode==='battle')&&KEYDIR[e.key]&&e.key.startsWith('Arrow')){e.preventDefault();navFocus($('#panel'),KEYDIR[e.key],'button');return}
 if(mode==='battle'){if(/^[1-4]$/.test(e.key)){const b=$(`#bbody .opt[data-i="${+e.key-1}"]`);if(b&&!b.disabled)b.click()}if(e.key==='p'||e.key==='P'){const pb=$('#playBtn');if(pb)pb.click()}return}
 if(KEYDIR[e.key]&&mode==='world'){held=KEYDIR[e.key];e.preventDefault();return}
 if(['z','Z',' ','Enter'].includes(e.key)&&(mode==='world'||mode==='dialog')){e.preventDefault();pressA();return}
 if(['x','X','Escape','Backspace'].includes(e.key)&&mode!=='title'){e.preventDefault();pressB()}});
document.addEventListener('keyup',e=>{if(KEYDIR[e.key]===held)held=null});
document.querySelectorAll('.dpad [data-dir]').forEach(b=>{const d=b.dataset.dir;
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(mode==='world')held=d;try{b.setPointerCapture(e.pointerId)}catch(_){}});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,()=>{if(held===d)held=null}))});
$('#aBtn').addEventListener('click',pressA);$('#bBtn').addEventListener('click',pressB);
$('#menuBtn').addEventListener('click',()=>{if(mode==='world')mainMenu();else if(mode==='menu')closePanel();else if(mode==='choice'&&CH)CH.cancel()});
$('#rubyBtn').addEventListener('click',()=>{if(!S)return;const o=['pinyin','zhuyin','off'];S.settings.ruby=o[(o.indexOf(S.settings.ruby)+1)%3];save();rebuild();hud();toast(UI[S.settings.ruby])});
window.addEventListener('resize',()=>{fit()});
new ResizeObserver(()=>fit()).observe(cv);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{sprites={}});

/* ---------- 啟動 ---------- */
function start(data){if(data&&data.S){S=data.S;begin(false)}else{const sv=load();bootBackdrop();
 if(sv){if(sv.settings){titleLang=sv.settings.lang||titleLang;titleRuby=sv.settings.ruby||titleRuby}bootBackdrop();flight(()=>askResume(sv))}else titleScreen()}requestAnimationFrame(loop)}
start({});
