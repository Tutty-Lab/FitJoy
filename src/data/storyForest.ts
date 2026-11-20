import type { SessionScene, Who, Line } from './storyDialog'

const l = (who: Who, de: string, vi: string): Line => ({ who, de, vi })

// Days 31–60: the forest of senses. The blue feather belongs to the fog heron, a fox named Fenna
// hoards pieces to keep her cubs warm, and the old storm is trapped in the forest's heart.
export const forestDialog: Record<number, SessionScene[]> = {
  31: [
    { pre: [
      l('v', 'So still hier. Und so grün.', 'Ở đây yên quá. Và xanh quá.'),
      l('p', 'Zu still. Wo ist das Meer? Ich vermisse das Meer.', 'Yên quá mức. Biển đâu rồi? Tớ nhớ biển.'),
      l('me', 'Was hat die Stimme gemeint – „hört zu“?', 'Giọng nói kia bảo “hãy lắng nghe” là ý gì?'),
    ], post: { de: 'Wenn alle still stehen, hört man es: Blätter rascheln in einem Rhythmus. Wie ein Herzschlag.', vi: 'Khi mọi người đứng yên, ta nghe thấy: lá cây xào xạc theo một nhịp. Như nhịp tim.' } },
    { pre: [
      l('v', 'Der Wald atmet. Und wir atmen mit.', 'Khu rừng đang thở. Và mình thở cùng nó.'),
      l('p', 'Ich atme schon die ganze Zeit. Bin ich gut?', 'Tớ thở suốt nãy giờ rồi. Tớ giỏi chứ?'),
      l('me', 'Sehr gut, Pip.', 'Rất giỏi, Pip.'),
    ], post: { de: 'Ein Pfad aus Moos leuchtet auf, Schritt für Schritt, im Takt eures Atems.', vi: 'Một lối rêu sáng lên từng bước, theo nhịp thở của cả nhóm.' } },
    { pre: [
      l('v', 'Der Moospfad trägt nur, wer langsam geht. Ganz weich auftreten.', 'Lối rêu chỉ nâng đỡ người đi chậm. Bước thật nhẹ.'),
      l('me', 'Weich und langsam.', 'Nhẹ và chậm.'),
    ], post: { de: 'Am Ende des Pfades steht ein riesiger Vogel aus Nebel. Ihm fehlt eine blaue Feder.', vi: 'Cuối lối rêu là một con chim khổng lồ làm từ sương. Nó thiếu một chiếc lông xanh.' } },
  ],
  32: [
    { pre: [
      l('v', 'Die Feder von Tag fünf! Sie gehört ihm.', 'Chiếc lông từ ngày thứ năm! Nó là của chú chim này.'),
      l('p', 'Ein Nebelreiher. Uralt. Sagt man. Ich hab nie einen gesehen. Ich hab Angst.', 'Một con diệc sương. Già lắm. Người ta bảo vậy. Tớ chưa thấy bao giờ. Tớ sợ.'),
      l('me', 'Geben wir sie zurück.', 'Mình trả lại cho nó.'),
    ], post: { de: 'Der Reiher neigt den Kopf. Als die Feder an ihrem Platz ist, wird sein Nebel heller.', vi: 'Chú diệc cúi đầu. Khi chiếc lông về đúng chỗ, làn sương quanh nó sáng lên.' } },
    { pre: [
      l('v', 'Der Reiher steht auf einem Bein. Stundenlang, sagen die Bäume.', 'Chú diệc đứng một chân. Hàng giờ liền, cây cối bảo vậy.'),
      l('p', 'Angeber.', 'Khoe khoang.'),
      l('me', 'Wir machen es ihm nach.', 'Mình bắt chước nó.'),
    ], post: { de: 'Der Reiher nickt anerkennend. Dann zeigt er mit dem Schnabel tiefer in den Wald.', vi: 'Chú diệc gật đầu khen ngợi. Rồi dùng mỏ chỉ sâu vào trong rừng.' } },
    { pre: [
      l('v', 'Er will uns führen. Aber nur, wenn wir ihm leise folgen.', 'Nó muốn dẫn đường. Nhưng chỉ khi mình đi theo thật khẽ.'),
      l('me', 'Leise wie Nebel.', 'Khẽ như sương.'),
    ], post: { de: 'Der Reiher bleibt an einem Bach stehen und legt etwas ab: das zweiunddreißigste Stück.', vi: 'Chú diệc dừng bên một con suối và đặt xuống một thứ: mảnh thứ ba mươi hai.' } },
  ],
  33: [
    { pre: [
      l('v', 'Über den Bach führen nur Trittsteine. Glatte, runde.', 'Qua suối chỉ có những hòn đá kê chân. Trơn và tròn.'),
      l('p', 'Ich fliege. Ihr springt. Viel Spaß.', 'Tớ bay. Các cậu nhảy. Chúc vui.'),
      l('me', 'Wir springen nicht. Wir steigen.', 'Mình không nhảy. Mình bước.'),
    ], post: { de: 'Erster Stein. Kurz stehen. Gewicht verlagern. Zweiter Stein.', vi: 'Hòn đá thứ nhất. Đứng chút. Chuyển trọng tâm. Hòn đá thứ hai.' } },
    { pre: [
      l('v', 'Der mittlere Stein wackelt. Wenn ich ruhig stehe, wackelt er weniger.', 'Hòn đá giữa bị lắc. Mình đứng yên thì nó lắc ít hơn.'),
      l('me', 'Ruhig bleiben.', 'Giữ bình tĩnh.'),
    ], post: { de: 'Geschafft bis zur Mitte. Unter dem Wasser glitzert etwas zwischen den Kieseln.', vi: 'Đã tới giữa suối. Dưới nước có gì đó lấp lánh giữa đám sỏi.' } },
    { pre: [
      l('v', 'Ich bücke mich ganz langsam, ohne vom Stein zu fallen.', 'Mình cúi xuống thật chậm, không để rơi khỏi đá.'),
      l('p', 'Wenn du fällst, rette ich dich. Glaube ich. Du bist schwer.', 'Cậu mà ngã, tớ cứu. Chắc vậy. Cậu nặng lắm.'),
      l('me', 'Er fällt nicht.', 'Bạn ấy không ngã đâu.'),
    ], post: { de: 'Das dreiunddreißigste Stück, kühl und nass. Am anderen Ufer sieht man Pfotenspuren – sie führen weg.', vi: 'Mảnh thứ ba mươi ba, mát lạnh và ướt. Bờ bên kia có dấu chân thú – dẫn đi xa.' } },
  ],
  34: [
    { pre: [
      l('v', 'Pfotenspuren. Klein, mit fünf Zehen.', 'Dấu chân thú. Nhỏ, có năm ngón.'),
      l('p', 'Fuchs. Füchse mögen Möwen. Zum Essen.', 'Cáo. Cáo thích hải âu. Để ăn.'),
      l('me', 'Wir passen auf dich auf, Pip.', 'Bọn mình sẽ bảo vệ cậu, Pip.'),
    ], post: { de: 'Die Spuren führen zu einem hohlen Baum. Darin: ein Lager voller glänzender Dinge.', vi: 'Dấu chân dẫn tới một cây rỗng ruột. Bên trong: một kho đầy đồ lấp lánh.' } },
    { pre: [
      l('v', 'Hier liegen Löffel, Knöpfe … und drei Steinstücke!', 'Ở đây có thìa, cúc áo … và ba mảnh đá!'),
      l('p', 'Jemand sammelt Glitzer. Ich mag diese Person.', 'Có người sưu tầm đồ lấp lánh. Tớ thích người này.'),
      l('me', 'Wir nehmen nichts, ohne zu fragen.', 'Mình không lấy gì khi chưa hỏi.'),
    ], post: { de: 'Hinter dem Baum funkeln zwei Augen. Eine Füchsin, ganz still.', vi: 'Sau gốc cây lóe lên hai con mắt. Một cô cáo, đứng im phăng phắc.' } },
    { pre: [
      l('v', 'Sie hat Angst. Ich gehe in die Hocke und bleibe ruhig.', 'Cô ấy sợ. Mình ngồi xổm xuống và giữ bình tĩnh.'),
      l('me', 'Hallo. Wir tun dir nichts.', 'Chào bạn. Bọn mình không làm hại bạn đâu.'),
    ], post: { de: 'Die Füchsin heißt Fenna. „Die Steine sind warm“, sagt sie. „Meine Kleinen frieren.“', vi: 'Cô cáo tên là Fenna. “Những hòn đá ấm lắm”, cô nói. “Các con tôi lạnh.”' } },
  ],
  35: [
    { pre: [
      l('v', 'Fenna braucht die Wärme. Wir brauchen die Stücke. Was nun?', 'Fenna cần hơi ấm. Bọn mình cần các mảnh đá. Giờ sao đây?'),
      l('p', 'Einfach nehmen und weglaufen? … Das war ein Witz. Halb.', 'Cứ lấy rồi chạy? … Đùa thôi. Một nửa.'),
      l('me', 'Wir finden eine andere Wärme für sie.', 'Mình tìm hơi ấm khác cho họ.'),
    ], post: { de: 'Vestibu sammelt trockenes Moos und Laub. Ein Nest für die Fuchskinder.', vi: 'Vestibu gom rêu khô và lá. Một cái ổ cho lũ cáo con.' } },
    { pre: [
      l('v', 'Das Moos wächst hoch oben an den Stämmen. Ich muss mich strecken.', 'Rêu mọc tít trên thân cây. Mình phải vươn người.'),
      l('p', 'Ich bringe Federn! Meine alten. Sehr warm. Sehr edel.', 'Tớ mang lông tới! Lông cũ của tớ. Ấm lắm. Sang lắm.'),
      l('me', 'Danke, Pip!', 'Cảm ơn Pip!'),
    ], post: { de: 'Das Nest ist weich und warm. Drei kleine Füchse kuscheln sich hinein.', vi: 'Cái ổ êm và ấm. Ba chú cáo con chui rúc vào.' } },
    { pre: [
      l('v', 'Fenna schaut uns lange an.', 'Fenna nhìn bọn mình rất lâu.'),
      l('me', 'Behalte ruhig eins, bis wir zurückkommen.', 'Cứ giữ một mảnh tới khi bọn mình quay lại nhé.'),
    ], post: { de: 'Fenna gibt zwei Stücke her und behält eines für die Nacht. „Ich zeige euch den Weg“, sagt sie. Das fünfunddreißigste Stück ist da.', vi: 'Fenna trao hai mảnh và giữ một mảnh cho đêm nay. “Tôi sẽ chỉ đường cho các bạn”, cô nói. Mảnh thứ ba mươi lăm đã có.' } },
  ],
  36: [
    { pre: [
      l('v', 'Fenna sagt, der Wald hat fünf Lichtungen. Eine für jeden Sinn.', 'Fenna bảo khu rừng có năm khoảng trống. Mỗi cái cho một giác quan.'),
      l('p', 'Fünf? Ich habe nur einen Sinn. Hunger.', 'Năm à? Tớ chỉ có một giác quan. Đói.'),
      l('me', 'Wir fangen mit dem Hören an.', 'Mình bắt đầu với thính giác.'),
    ], post: { de: 'Die Lichtung des Hörens ist voller Glockenblumen. Sie klingen, wenn der Wind sie streift.', vi: 'Khoảng trống của thính giác đầy hoa chuông. Chúng reo khi gió lướt qua.' } },
    { pre: [
      l('v', 'Eine Blume klingt falsch. Ich finde sie nur mit geschlossenen Augen.', 'Có một bông kêu sai nhịp. Mình chỉ tìm được nó khi nhắm mắt.'),
      l('me', 'Augen zu, ganz still.', 'Nhắm mắt, thật yên.'),
    ], post: { de: 'Ganz links, die kleinste Blume. In ihrem Kelch klemmt etwas Hartes.', vi: 'Tít bên trái, bông hoa nhỏ nhất. Trong đài hoa có thứ gì cứng bị kẹt.' } },
    { pre: [
      l('v', 'Vorsichtig herausholen. Die Blume darf nicht knicken.', 'Lấy ra thật nhẹ. Không được làm gãy hoa.'),
      l('p', 'Ich bin ganz leise. Seht ihr? Kein Pieps. … Pieps.', 'Tớ im lặng lắm. Thấy không? Không một tiếng. … Chíp.'),
      l('me', 'Psst, Pip!', 'Suỵt, Pip!'),
    ], post: { de: 'Das sechsunddreißigste Stück. Jetzt klingen alle Blumen gemeinsam – eine Melodie, die nach Hafen klingt.', vi: 'Mảnh thứ ba mươi sáu. Giờ cả cánh đồng hoa cùng reo – một giai điệu nghe như bến cảng.' } },
  ],
  37: [
    { pre: [
      l('v', 'Die zweite Lichtung: Fühlen. Hier ist alles weich – Moos, Gras, Blätter.', 'Khoảng trống thứ hai: xúc giác. Ở đây mọi thứ đều mềm – rêu, cỏ, lá.'),
      l('p', 'Und der Boden schaukelt wie ein Boot!', 'Mặt đất còn tròng trành như thuyền nữa!'),
      l('me', 'Wie auf einem Kissen stehen.', 'Như đứng trên gối vậy.'),
    ], post: { de: 'Auf weichem Boden müssen die Füße viel mehr arbeiten. Vestibu spürt jede kleine Bewegung.', vi: 'Trên nền mềm, bàn chân phải làm việc nhiều hơn. Vestibu cảm nhận từng chuyển động nhỏ.' } },
    { pre: [
      l('v', 'Unter dem Moos liegt etwas. Ich fühle es mit dem Fuß.', 'Dưới lớp rêu có gì đó. Mình cảm thấy bằng bàn chân.'),
      l('me', 'Wo genau?', 'Chỗ nào?'),
      l('v', 'Weiter vorn. Ich taste mich ran.', 'Phía trước. Mình dò tới đó.'),
    ], post: { de: 'Schritt für Schritt tastet Vestibu sich vor, bis sein Fuß auf etwas Hartem steht.', vi: 'Từng bước, Vestibu dò dẫm tiến lên, tới khi chân chạm phải thứ gì cứng.' } },
    { pre: [
      l('v', 'Hier! Jetzt ruhig stehen bleiben und graben.', 'Đây rồi! Giờ đứng yên và đào.'),
      l('me', 'Ich helfe graben.', 'Mình đào cùng.'),
    ], post: { de: 'Das siebenunddreißigste Stück, warm wie eine Hand. Fenna nickt: „Weiter zur Lichtung des Riechens.“', vi: 'Mảnh thứ ba mươi bảy, ấm như một bàn tay. Fenna gật đầu: “Tiếp tới khoảng trống khứu giác.”' } },
  ],
  38: [
    { pre: [
      l('p', 'Riechen kann ich! Ich rieche … Fisch. Nein. Doch. Nein.', 'Ngửi thì tớ giỏi! Tớ ngửi thấy … cá. Không. Có. Không.'),
      l('v', 'Hier riecht es nach Kiefern, Pilzen und … Zimt?', 'Ở đây có mùi thông, nấm và … quế?'),
      l('me', 'Zimt im Wald?', 'Quế trong rừng à?'),
    ], post: { de: 'Der Zimtduft kommt aus einer Höhle zwischen Wurzeln. Drinnen brennt ein kleines Feuer.', vi: 'Mùi quế bay ra từ một cái hang giữa đám rễ. Bên trong có ngọn lửa nhỏ.' } },
    { pre: [
      l('v', 'Hier wohnt jemand. Ein Igel mit einer Schürze!', 'Có người sống ở đây. Một chú nhím đeo tạp dề!'),
      l('p', 'Er backt Kekse! Ist das Ilses Rezept?', 'Chú ấy nướng bánh quy! Có phải công thức của Ilse không?'),
      l('me', 'Fragen wir ihn.', 'Mình hỏi chú ấy.'),
    ], post: { de: 'Der Igel heißt Bruno. „Ilse hat mir das Rezept geschenkt. Vor dem Sturm kam sie jede Woche.“', vi: 'Chú nhím tên Bruno. “Ilse tặng tôi công thức này. Trước cơn bão, tuần nào bà cũng ghé.”' } },
    { pre: [
      l('v', 'Bruno sagt, wir dürfen einen Keks – wenn wir das Mehl vom hohen Regal holen.', 'Bruno bảo được ăn một cái bánh – nếu lấy giúp chú bao bột trên kệ cao.'),
      l('me', 'Auf Zehenspitzen!', 'Kiễng chân nào!'),
    ], post: { de: 'Pip bekommt endlich seinen Keks. Und hinter dem Mehl: das achtunddreißigste Stück.', vi: 'Pip cuối cùng cũng có bánh quy. Và sau bao bột: mảnh thứ ba mươi tám.' } },
  ],
  39: [
    { pre: [
      l('v', 'Die vierte Lichtung: Sehen. Aber hier ist dichter Nebel.', 'Khoảng trống thứ tư: thị giác. Nhưng ở đây sương dày đặc.'),
      l('p', 'Sehen im Nebel? Das ist doch gemein.', 'Nhìn trong sương? Thế thì ác quá.'),
      l('me', 'Vielleicht geht es um genaues Hinsehen.', 'Có lẽ là về việc nhìn thật kỹ.'),
    ], post: { de: 'Wenn man ganz ruhig auf einen Punkt schaut, lichtet sich der Nebel ein wenig.', vi: 'Khi nhìn thật yên vào một điểm, sương tan bớt một chút.' } },
    { pre: [
      l('v', 'Ein Punkt, fest im Blick. Dann wackelt auch der Körper weniger.', 'Một điểm, mắt nhìn chắc. Khi đó cơ thể cũng bớt chao.'),
      l('me', 'Blick auf den Punkt.', 'Mắt nhìn vào điểm.'),
    ], post: { de: 'Der Nebel öffnet einen Tunnel. Am Ende: ein leuchtender Pilzring.', vi: 'Sương mở ra một đường hầm. Cuối đường: một vòng nấm phát sáng.' } },
    { pre: [
      l('v', 'In der Mitte des Rings liegt ein Stück. Aber die Pilze sind empfindlich.', 'Giữa vòng nấm có một mảnh đá. Nhưng nấm mỏng manh lắm.'),
      l('p', 'Also nicht drauftreten. Verstanden. Ich fliege.', 'Vậy không được giẫm lên. Hiểu rồi. Tớ bay.'),
      l('me', 'Großer Schritt, ganz sicher.', 'Bước dài, thật vững.'),
    ], post: { de: 'Ein langer, sicherer Schritt über die Pilze. Das neununddreißigste Stück leuchtet in Vestibus Hand.', vi: 'Một bước dài, vững chãi qua vòng nấm. Mảnh thứ ba mươi chín sáng lên trong tay Vestibu.' } },
  ],
  40: [
    { pre: [
      l('v', 'Vierzig Tage! Die letzte Lichtung: Schmecken.', 'Bốn mươi ngày! Khoảng trống cuối: vị giác.'),
      l('p', 'ENDLICH meine Lichtung!', 'CUỐI CÙNG cũng tới khoảng trống của tớ!'),
      l('me', 'Was gibt es zu schmecken?', 'Có gì để nếm?'),
    ], post: { de: 'Brombeersträucher, so weit man sieht. Die reifsten hängen ganz oben.', vi: 'Bụi mâm xôi trải dài tít tắp. Quả chín nhất treo trên cao.' } },
    { pre: [
      l('v', 'Pflücken auf einem Bein – und dabei nicht in die Dornen fallen.', 'Hái quả trên một chân – mà không ngã vào gai.'),
      l('p', 'Eine für mich, eine für den Korb, eine für mich …', 'Một quả cho tớ, một quả vào giỏ, một quả cho tớ …'),
      l('me', 'Pip!', 'Pip!'),
    ], post: { de: 'Der Korb ist voll. Pips Schnabel ist lila.', vi: 'Giỏ đã đầy. Mỏ Pip tím ngắt.' } },
    { pre: [
      l('v', 'Bruno backt daraus einen Kuchen für alle. Zur Feier von vierzig Tagen.', 'Bruno sẽ nướng bánh cho mọi người. Mừng bốn mươi ngày.'),
      l('me', 'Ein Waldfest!', 'Tiệc trong rừng!'),
    ], post: { de: 'Im Kuchen backt Bruno eine Überraschung ein: das vierzigste Stück. Pip hätte es fast verschluckt.', vi: 'Bruno giấu một bất ngờ trong bánh: mảnh thứ bốn mươi. Pip suýt nuốt luôn.' } },
  ],
  41: [
    { pre: [
      l('v', 'Nach dem Fest ist es seltsam still. Fenna ist besorgt.', 'Sau bữa tiệc mọi thứ im ắng lạ thường. Fenna lo lắng.'),
      l('p', 'Was ist los? Hab ich zu viel Kuchen gegessen?', 'Chuyện gì vậy? Tớ ăn nhiều bánh quá à?'),
      l('me', 'Fenna, was ist?', 'Fenna, sao vậy?'),
    ], post: { de: 'Fenna erzählt: Im Herzen des Waldes heult nachts ein Wind. Seit dem Sturm. Er kommt nicht heraus.', vi: 'Fenna kể: Ở trái tim khu rừng, đêm nào cũng có tiếng gió hú. Từ sau cơn bão. Nó không thoát ra được.' } },
    { pre: [
      l('v', 'Der Sturm selbst … er ist im Wald gefangen?', 'Chính cơn bão … bị mắc kẹt trong rừng ư?'),
      l('p', 'Wusel zittert. Er kennt diesen Wind.', 'Xoáy Nhỏ run lên. Nó biết cơn gió này.'),
      l('me', 'Ist das Wusels Familie?', 'Đó là gia đình của Xoáy Nhỏ à?'),
    ], post: { de: 'Wusel dreht sich traurig. Ja – der große Sturm ist seine Mutter.', vi: 'Xoáy Nhỏ xoay buồn bã. Đúng vậy – cơn bão lớn là mẹ của nó.' } },
    { pre: [
      l('v', 'Dann bringen wir Wusel zu ihr. Aber sicher und mutig.', 'Vậy mình đưa Xoáy Nhỏ tới chỗ mẹ. Nhưng phải an toàn và dũng cảm.'),
      l('me', 'Wir sind bei dir, Wusel.', 'Bọn mình ở bên cậu, Xoáy Nhỏ.'),
    ], post: { de: 'Wusel schmiegt sich an dich. In seinem Wirbel dreht sich das einundvierzigste Stück – er hatte es die ganze Zeit aufbewahrt.', vi: 'Xoáy Nhỏ nép vào bạn. Trong vòng xoáy của nó là mảnh thứ bốn mươi mốt – nó đã giữ suốt thời gian qua.' } },
  ],
  42: [
    { pre: [
      l('v', 'Der Weg zum Herzen des Waldes ist voller Wurzeln.', 'Đường tới trái tim khu rừng đầy rễ cây.'),
      l('p', 'Wurzeln sind Stolperfallen mit Ambitionen.', 'Rễ cây là bẫy vấp có tham vọng.'),
      l('me', 'Füße heben, genau hinschauen.', 'Nhấc chân, nhìn thật kỹ.'),
    ], post: { de: 'Über, unter, zwischen den Wurzeln. Vestibu stolpert kein einziges Mal.', vi: 'Bước qua, chui dưới, len giữa những bộ rễ. Vestibu không vấp lần nào.' } },
    { pre: [
      l('v', 'Hier ist eine Wurzel wie ein Seil gespannt. Darauf balanciere ich hinüber.', 'Có một cái rễ căng như sợi dây. Mình giữ thăng bằng đi qua nó.'),
      l('me', 'Langsam!', 'Từ từ thôi!'),
    ], post: { de: 'Auf der anderen Seite wartet der Nebelreiher. Er hat auf euch gewartet.', vi: 'Bên kia, chú diệc sương đang đợi. Nó đã chờ cả nhóm.' } },
    { pre: [
      l('v', 'Der Reiher zeigt uns eine Abkürzung – über umgestürzte Stämme.', 'Chú diệc chỉ cho mình đường tắt – qua những thân cây đổ.'),
      l('p', 'Abkürzung heißt meistens: schwieriger.', 'Đường tắt thường nghĩa là: khó hơn.'),
      l('me', 'Wir schaffen das.', 'Mình làm được.'),
    ], post: { de: 'Auf dem letzten Stamm wächst ein Pilz in Form eines Sterns. Darunter: das zweiundvierzigste Stück.', vi: 'Trên thân cây cuối mọc một cây nấm hình ngôi sao. Bên dưới là mảnh thứ bốn mươi hai.' } },
  ],
  43: [
    { pre: [
      l('v', 'Es wird dunkel. Wir übernachten unter der großen Eiche.', 'Trời tối rồi. Mình ngủ lại dưới cây sồi lớn.'),
      l('p', 'Im Wald. Nachts. Mit Füchsen. Super.', 'Trong rừng. Ban đêm. Có cáo. Tuyệt thật.'),
      l('me', 'Fenna ist doch unsere Freundin.', 'Fenna là bạn của mình mà.'),
    ], post: { de: 'Fenna und ihre Kleinen legen sich um das Lager. Es ist warm.', vi: 'Fenna và các con nằm quanh chỗ ngủ. Ấm áp lắm.' } },
    { pre: [
      l('v', 'Bevor wir schlafen, dehnen wir uns. Ganz langsam, ohne Eile.', 'Trước khi ngủ, mình giãn cơ. Thật chậm, không vội.'),
      l('p', 'Möwen dehnen sich nicht. Möwen sind von Natur aus perfekt.', 'Hải âu không cần giãn cơ. Hải âu hoàn hảo bẩm sinh.'),
      l('me', 'Versuch es trotzdem.', 'Cứ thử đi.'),
    ], post: { de: 'Pip versucht es. Er gibt zu: Es tut gut.', vi: 'Pip thử. Nó thừa nhận: dễ chịu thật.' } },
    { pre: [
      l('v', 'Hörst du? Das Heulen. Es ist näher als gedacht.', 'Bạn nghe không? Tiếng hú. Gần hơn mình tưởng.'),
      l('me', 'Wir bleiben ruhig.', 'Mình giữ bình tĩnh.'),
    ], post: { de: 'In der Nacht fallen Blätter wie Regen. Am Morgen liegt zwischen ihnen das dreiundvierzigste Stück.', vi: 'Trong đêm lá rơi như mưa. Sáng ra, giữa đám lá là mảnh thứ bốn mươi ba.' } },
  ],
  44: [
    { pre: [
      l('v', 'Vor uns ist eine Schlucht. Nur eine alte Hängebrücke führt hinüber.', 'Trước mặt là một hẻm núi. Chỉ có cây cầu treo cũ bắc qua.'),
      l('p', 'Die schwankt. Ich sehe es von hier.', 'Nó lắc lư. Tớ thấy từ đây luôn.'),
      l('me', 'Schwanken kennen wir.', 'Chao đảo thì mình quen rồi.'),
    ], post: { de: 'Die ersten Bretter knarren. Vestibu hält sich am Seil fest.', vi: 'Những tấm ván đầu kêu cót két. Vestibu bám chặt dây.' } },
    { pre: [
      l('v', 'Jetzt ohne festhalten. Nur mit meinem Gleichgewicht.', 'Giờ không bám nữa. Chỉ dựa vào thăng bằng của mình.'),
      l('p', 'Du bist verrückt. Und mutig. Beides.', 'Cậu điên thật. Và dũng cảm. Cả hai.'),
      l('me', 'Ich glaube an dich!', 'Mình tin bạn!'),
    ], post: { de: 'In der Mitte bleibt Vestibu stehen. Die Brücke schwingt – und er schwingt einfach mit.', vi: 'Giữa cầu, Vestibu dừng lại. Cây cầu đung đưa – và cậu đung đưa theo nó.' } },
    { pre: [
      l('v', 'Ein Brett fehlt. Ich mache einen großen Schritt.', 'Thiếu một tấm ván. Mình bước một bước dài.'),
      l('me', 'Jetzt!', 'Ngay bây giờ!'),
    ], post: { de: 'Drüben! Am Brückenpfosten hängt in einem Netz das vierundvierzigste Stück.', vi: 'Sang bờ rồi! Trên cột cầu, trong một chiếc lưới, là mảnh thứ bốn mươi bốn.' } },
  ],
  45: [
    { pre: [
      l('v', 'Halbzeit! Fünfundvierzig Tage. Wir sind die Hälfte des Weges gegangen.', 'Nửa chặng đường! Bốn mươi lăm ngày. Mình đã đi được một nửa.'),
      l('p', 'Halbzeit heißt Pause. Pause heißt Snack.', 'Nửa chặng nghĩa là nghỉ. Nghỉ nghĩa là ăn vặt.'),
      l('me', 'Kurze Pause, Pip.', 'Nghỉ chút thôi, Pip.'),
    ], post: { de: 'Ein Brief kommt mit dem Wind. Ilse schreibt: „Ich sehe euer Licht schon im Wald. Ihr seid nah.“', vi: 'Một lá thư bay tới theo gió. Ilse viết: “Ta đã thấy ánh sáng của các con trong rừng. Các con gần tới rồi.”' } },
    { pre: [
      l('v', 'Ilse sieht uns! Die Stücke leuchten jetzt zusammen so hell.', 'Ilse thấy bọn mình! Các mảnh đá giờ cùng sáng rực.'),
      l('p', 'Wir sind ein Leuchtfeuer auf Beinen.', 'Bọn mình là ngọn đuốc biết đi.'),
      l('me', 'Schicken wir ihr ein Zeichen.', 'Gửi bà một tín hiệu nhé.'),
    ], post: { de: 'Vestibu hebt die Stücke hoch. Weit hinter den Bäumen antwortet ein Licht.', vi: 'Vestibu nâng các mảnh đá lên cao. Xa sau rặng cây, một ánh đèn đáp lại.' } },
    { pre: [
      l('v', 'Noch einmal ganz konzentriert. Für die zweite Hälfte.', 'Thêm một lượt thật tập trung. Cho nửa chặng sau.'),
      l('me', 'Für die zweite Hälfte!', 'Cho nửa chặng sau!'),
    ], post: { de: 'Fenna kommt angerannt: Sie bringt das Stück, das sie behalten hatte. „Meine Kleinen haben jetzt das Nest.“ Fünfundvierzig.', vi: 'Fenna chạy tới: cô mang mảnh đá đã giữ lại. “Các con tôi giờ có ổ rồi.” Bốn mươi lăm.' } },
  ],
  46: [
    { pre: [
      l('v', 'Der Wind wird stärker. Wir sind nah am Herzen des Waldes.', 'Gió mạnh dần. Mình đã gần trái tim khu rừng.'),
      l('p', 'Meine Federn stehen ab. Das ist kein gutes Zeichen.', 'Lông tớ dựng đứng. Không phải điềm lành.'),
      l('me', 'Gegen den Wind stehen wir fest.', 'Mình đứng vững trước gió.'),
    ], post: { de: 'Jeder Schritt ist ein Kampf gegen den Wind. Aber Vestibu kippt nicht um.', vi: 'Mỗi bước là một cuộc vật lộn với gió. Nhưng Vestibu không ngã.' } },
    { pre: [
      l('v', 'Breiter Stand, Knie weich, Schwerpunkt tief. So hält mich nichts auf.', 'Đứng rộng chân, gối mềm, hạ trọng tâm. Thế thì chẳng gì cản nổi mình.'),
      l('p', 'Ich verstecke mich in deiner Kapuze, okay?', 'Tớ trốn trong mũ áo cậu nhé?'),
      l('me', 'Rein mit dir.', 'Vào đi.'),
    ], post: { de: 'Hinter einem Felsen ist es windstill. Eine kurze Rast.', vi: 'Sau một tảng đá gió lặng hẳn. Nghỉ chân một lát.' } },
    { pre: [
      l('v', 'Wusel zieht uns voran. Er will zu seiner Mutter.', 'Xoáy Nhỏ kéo mình đi tiếp. Nó muốn gặp mẹ.'),
      l('me', 'Wir kommen, Wusel.', 'Bọn mình tới đây, Xoáy Nhỏ.'),
    ], post: { de: 'Der Wind trägt etwas zu euch: das sechsundvierzigste Stück, als wäre es ein Gruß.', vi: 'Gió mang tới một thứ: mảnh thứ bốn mươi sáu, như một lời chào.' } },
  ],
  47: [
    { pre: [
      l('v', 'Da ist es. Das Herz des Waldes. Ein Kreis aus uralten Bäumen.', 'Kia rồi. Trái tim khu rừng. Một vòng tròn những cây cổ thụ.'),
      l('p', 'Und in der Mitte … oh. Oh nein.', 'Và ở giữa … ôi. Ôi không.'),
      l('me', 'Der Sturm.', 'Cơn bão.'),
    ], post: { de: 'Ein riesiger grauer Wirbel dreht sich zwischen den Bäumen gefangen. Er heult vor Erschöpfung.', vi: 'Một vòng xoáy xám khổng lồ bị mắc kẹt giữa những thân cây. Nó hú lên vì kiệt sức.' } },
    { pre: [
      l('v', 'Sie dreht sich und dreht sich und kann nicht aufhören. Sie hat das Gleichgewicht verloren.', 'Bà ấy cứ xoay mãi không dừng được. Bà đã mất thăng bằng.'),
      l('p', 'Wie wir am ersten Tag.', 'Như bọn mình ngày đầu tiên.'),
      l('me', 'Dann zeigen wir ihr, wie es geht.', 'Vậy mình chỉ cho bà cách làm.'),
    ], post: { de: 'Vestibu stellt sich an den Rand des Kreises und atmet langsam. Der Sturm stockt kurz.', vi: 'Vestibu đứng ở mép vòng tròn và thở chậm. Cơn bão khựng lại trong giây lát.' } },
    { pre: [
      l('v', 'Es wirkt! Aber allein bin ich zu klein. Hilfst du mir?', 'Có tác dụng rồi! Nhưng một mình mình quá nhỏ. Bạn giúp mình nhé?'),
      l('me', 'Zusammen atmen.', 'Cùng nhau thở.'),
    ], post: { de: 'Der Sturm wird langsamer. Ein Stück fliegt aus ihm heraus und landet vor deinen Füßen. Siebenundvierzig.', vi: 'Cơn bão chậm lại. Một mảnh đá bay ra và đáp xuống trước chân bạn. Bốn mươi bảy.' } },
  ],
  48: [
    { pre: [
      l('v', 'Der Sturm ist nicht böse. Sie hat Angst, so wie Wusel damals.', 'Cơn bão không xấu. Bà đang sợ, giống Xoáy Nhỏ hồi trước.'),
      l('p', 'Ein ängstlicher Sturm. Das erklärt vieles.', 'Một cơn bão sợ hãi. Giải thích được nhiều chuyện đấy.'),
      l('me', 'Wie helfen wir ihr?', 'Mình giúp bà thế nào?'),
    ], post: { de: 'Fenna weiß es: „Die Bäume halten sie fest. Sie müssen sie loslassen. Aber nur, wenn sie ruhig ist.“', vi: 'Fenna biết: “Những cái cây đang giữ chặt bà. Chúng phải buông ra. Nhưng chỉ khi bà bình tĩnh.”' } },
    { pre: [
      l('v', 'Wir brauchen alle: Fenna, Bruno, den Reiher. Jeder steht ruhig im Kreis.', 'Cần tất cả mọi người: Fenna, Bruno, chú diệc. Ai cũng đứng thật yên trong vòng tròn.'),
      l('p', 'Ich stehe auch ruhig! Schaut! … Okay, fast.', 'Tớ cũng đứng yên! Nhìn này! … Được rồi, gần như thế.'),
      l('me', 'Alle zusammen.', 'Tất cả cùng nhau.'),
    ], post: { de: 'Ein Kreis aus Freunden um den Sturm. Ihr Heulen wird leiser.', vi: 'Một vòng tròn bạn bè quanh cơn bão. Tiếng hú của bà nhỏ dần.' } },
    { pre: [
      l('v', 'Wusel fliegt zu ihr. Ganz vorsichtig.', 'Xoáy Nhỏ bay tới bên mẹ. Thật nhẹ nhàng.'),
      l('me', 'Du schaffst das, Wusel.', 'Cậu làm được, Xoáy Nhỏ.'),
    ], post: { de: 'Mutter und Kind drehen sich zusammen – ruhig, im gleichen Takt. Das achtundvierzigste Stück fällt zu Boden.', vi: 'Mẹ và con cùng xoay – nhẹ nhàng, chung một nhịp. Mảnh thứ bốn mươi tám rơi xuống đất.' } },
  ],
  49: [
    { pre: [
      l('v', 'Die Bäume bewegen sich. Sie lassen ihre Äste los.', 'Những cái cây đang chuyển động. Chúng buông cành ra.'),
      l('p', 'Und wenn sie wieder wild wird?', 'Lỡ bà lại nổi điên thì sao?'),
      l('me', 'Dann helfen wir wieder.', 'Thì mình lại giúp.'),
    ], post: { de: 'Ein Ast nach dem anderen öffnet sich. Licht fällt in den Kreis.', vi: 'Từng cành cây mở ra. Ánh sáng tràn vào vòng tròn.' } },
    { pre: [
      l('v', 'Jetzt der schwerste Teil: ganz still stehen, während sie an uns vorbeizieht.', 'Giờ là phần khó nhất: đứng thật yên khi bà đi ngang qua.'),
      l('p', 'Ich halte mich an dir fest.', 'Tớ bám vào cậu.'),
      l('me', 'Fest stehen!', 'Đứng vững!'),
    ], post: { de: 'Der Wind rauscht an allen vorbei – warm diesmal, nicht kalt. Niemand fällt.', vi: 'Gió lướt qua mọi người – lần này ấm áp, không còn lạnh. Không ai ngã.' } },
    { pre: [
      l('v', 'Sie ist frei. Hörst du? Sie singt.', 'Bà được tự do rồi. Bạn nghe không? Bà đang hát.'),
      l('me', 'Wie das Windspiel im Hafen.', 'Như chuông gió ở bến cảng.'),
    ], post: { de: 'Der große Wind steigt in den Himmel. Wusel bleibt bei euch – „noch ein bisschen“, flüstert er. Neunundvierzig.', vi: 'Cơn gió lớn bay lên trời. Xoáy Nhỏ ở lại với cả nhóm – “thêm chút nữa thôi”, nó thì thầm. Bốn mươi chín.' } },
  ],
  50: [
    { pre: [
      l('v', 'Fünfzig Tage! Und der Wald ist wie verwandelt.', 'Năm mươi ngày! Khu rừng như được thay áo mới.'),
      l('p', 'Die Vögel singen. Sogar die nervigen.', 'Chim hót líu lo. Kể cả mấy con phiền phức.'),
      l('me', 'Und die Insel?', 'Còn hòn đảo?'),
      l('v', 'Sie schwankt fast gar nicht mehr. Nur noch ganz leise.', 'Gần như không còn chao nữa. Chỉ hơi khẽ thôi.'),
    ], post: { de: 'Der Nebelreiher breitet die Flügel aus. Zum ersten Mal ist er nicht grau, sondern silbern.', vi: 'Chú diệc sương dang rộng cánh. Lần đầu tiên nó không xám, mà ánh bạc.' } },
    { pre: [
      l('v', 'Der Reiher will uns etwas zeigen. Von oben.', 'Chú diệc muốn cho bọn mình xem một thứ. Từ trên cao.'),
      l('p', 'Fliegen? Endlich! Ich zeige euch, wie es geht.', 'Bay hả? Cuối cùng! Để tớ chỉ cho.'),
      l('me', 'Wir klettern auf den höchsten Baum.', 'Mình leo lên cây cao nhất.'),
    ], post: { de: 'Von der Baumkrone sieht man die ganze Insel. Und ganz am Ende: den Leuchtturm.', vi: 'Từ ngọn cây nhìn thấy cả hòn đảo. Và tận cùng: ngọn hải đăng.' } },
    { pre: [
      l('v', 'Noch zehn Tage durch den Wald. Dann sind wir da.', 'Còn mười ngày xuyên rừng. Rồi mình sẽ tới.'),
      l('me', 'Zehn Tage schaffen wir.', 'Mười ngày thì mình làm được.'),
    ], post: { de: 'In einem Vogelnest in der Krone liegt das fünfzigste Stück. Die Vögel geben es gern her.', vi: 'Trong tổ chim trên ngọn cây là mảnh thứ năm mươi. Lũ chim vui vẻ nhường lại.' } },
  ],
  51: [
    { pre: [
      l('v', 'Bruno hat uns Proviant gepackt. Und ein Rezept für Ilse.', 'Bruno gói lương thực cho bọn mình. Và một công thức cho Ilse.'),
      l('p', 'Ist es ein Fischkeks-Rezept?', 'Có phải công thức bánh quy cá không?'),
      l('me', 'Bestimmt nicht, Pip.', 'Chắc chắn không, Pip.'),
    ], post: { de: 'Der Weg führt bergab. Steile Hänge voller Laub.', vi: 'Đường đi dốc xuống. Sườn dốc phủ đầy lá.' } },
    { pre: [
      l('v', 'Bergab ist schwerer als bergauf. Kleine Schritte, Gewicht nach hinten.', 'Xuống dốc khó hơn lên dốc. Bước nhỏ, dồn trọng tâm ra sau.'),
      l('p', 'Ich rutsche einfach. Wiiieee!', 'Tớ cứ thế trượt. Uiiii!'),
      l('me', 'Pip, vorsichtig!', 'Pip, cẩn thận!'),
    ], post: { de: 'Pip landet in einem Laubhaufen. Ihm geht es gut. Er will noch mal.', vi: 'Pip đáp vào một đống lá. Nó không sao. Còn đòi trượt lần nữa.' } },
    { pre: [
      l('v', 'Unten im Tal fließt ein Fluss. Daneben glitzert es.', 'Dưới thung lũng có con sông. Bên cạnh có ánh lấp lánh.'),
      l('me', 'Ganz ruhig runter.', 'Xuống thật bình tĩnh.'),
    ], post: { de: 'Am Flussufer, zwischen Schilf: das einundfünfzigste Stück.', vi: 'Bên bờ sông, giữa đám lau sậy: mảnh thứ năm mươi mốt.' } },
  ],
  52: [
    { pre: [
      l('v', 'Der Fluss ist zu tief zum Durchwaten. Wir brauchen ein Floß.', 'Sông sâu quá không lội được. Mình cần một cái bè.'),
      l('p', 'Floß bauen! Ich bin der Kapitän.', 'Đóng bè! Tớ làm thuyền trưởng.'),
      l('me', 'Du warst schon Fahnenkapitän.', 'Cậu làm thuyền trưởng cờ rồi mà.'),
    ], post: { de: 'Stämme, Seile, Geduld. Das Floß nimmt Form an.', vi: 'Thân cây, dây thừng, sự kiên nhẫn. Chiếc bè thành hình.' } },
    { pre: [
      l('v', 'Auf dem Floß stehen ist wie auf dem Boot. Knie weich, Blick nach vorn.', 'Đứng trên bè cũng như trên thuyền. Gối mềm, mắt nhìn thẳng.'),
      l('p', 'Volle Fahrt voraus! … Ist das ein Strudel?', 'Tiến hết tốc lực! … Kia có phải xoáy nước không?'),
      l('me', 'Ruhig steuern.', 'Lái thật bình tĩnh.'),
    ], post: { de: 'Vestibu lenkt das Floß sicher am Strudel vorbei.', vi: 'Vestibu lái bè an toàn tránh xoáy nước.' } },
    { pre: [
      l('v', 'Am anderen Ufer wartet jemand. Ein Biber!', 'Bờ bên kia có ai đó đang đợi. Một chú hải ly!'),
      l('me', 'Hallo!', 'Xin chào!'),
    ], post: { de: 'Der Biber hat beim Dammbau ein seltsames Stück gefunden. Er tauscht es gegen das Floß. Zweiundfünfzig.', vi: 'Chú hải ly tìm thấy một mảnh lạ khi đắp đập. Chú đổi nó lấy chiếc bè. Năm mươi hai.' } },
  ],
  53: [
    { pre: [
      l('v', 'Heute ist der Wald voller Glühwürmchen.', 'Hôm nay khu rừng đầy đom đóm.'),
      l('p', 'Fliegende Lichter! Wie kleine Leuchttürme.', 'Đèn biết bay! Như những ngọn hải đăng tí hon.'),
      l('me', 'Sie zeigen uns den Weg.', 'Chúng chỉ đường cho mình.'),
    ], post: { de: 'Die Glühwürmchen tanzen in einer Linie durch den dunklen Wald.', vi: 'Đom đóm nhảy múa thành một hàng xuyên qua rừng tối.' } },
    { pre: [
      l('v', 'Im Dunkeln sehe ich meine Füße nicht. Ich muss fühlen, wo ich stehe.', 'Trong tối mình không thấy chân. Phải cảm nhận mình đang đứng đâu.'),
      l('p', 'Wie in der Lichtung des Fühlens!', 'Như ở khoảng trống xúc giác!'),
      l('me', 'Wir haben das geübt.', 'Mình tập rồi mà.'),
    ], post: { de: 'Ohne zu sehen findet Vestibu sicher seinen Weg. Die Übung hat sich gelohnt.', vi: 'Không cần nhìn, Vestibu vẫn tìm đường an toàn. Luyện tập thật đáng.' } },
    { pre: [
      l('v', 'Die Glühwürmchen sammeln sich an einer Stelle. Sie leuchten um etwas herum.', 'Đom đóm tụ lại một chỗ. Chúng sáng quanh một thứ gì đó.'),
      l('me', 'Ein Stück!', 'Một mảnh đá!'),
    ], post: { de: 'Das dreiundfünfzigste Stück, umschwirrt von Licht.', vi: 'Mảnh thứ năm mươi ba, có ánh sáng bay lượn quanh.' } },
  ],
  54: [
    { pre: [
      l('p', 'Ich muss euch was gestehen.', 'Tớ phải thú nhận một chuyện.'),
      l('v', 'Was denn, Pip?', 'Chuyện gì vậy, Pip?'),
      l('p', 'Das erste Stück. Am ersten Tag. Ich hab es nicht gefunden. Ich hab es aus Ilses Garten genommen. Vor dem Sturm.', 'Mảnh đầu tiên. Ngày đầu tiên. Tớ không tìm thấy nó. Tớ lấy nó từ vườn của Ilse. Trước cơn bão.'),
      l('me', 'Oh, Pip …', 'Ôi, Pip …'),
    ], post: { de: 'Pip senkt den Kopf. „Ich wollte nur etwas Schönes haben. Vielleicht kam der Sturm deshalb?“', vi: 'Pip cúi đầu. “Tớ chỉ muốn có thứ gì đó đẹp. Có khi vì thế mà bão tới?”' } },
    { pre: [
      l('v', 'Nein, Pip. Stürme kommen einfach. Niemand ist schuld.', 'Không đâu, Pip. Bão tới thì tới thôi. Không ai có lỗi cả.'),
      l('p', 'Wirklich?', 'Thật không?'),
      l('me', 'Und du hast so viel geholfen.', 'Và cậu đã giúp rất nhiều.'),
    ], post: { de: 'Pip lächelt wieder. Ein bisschen wackelig. Aber er lächelt.', vi: 'Pip lại cười. Hơi run run. Nhưng nó cười.' } },
    { pre: [
      l('v', 'Wenn wir Ilse treffen, kannst du es ihr selbst sagen.', 'Khi gặp Ilse, cậu có thể tự nói với bà.'),
      l('me', 'Wir sind dabei.', 'Bọn mình ở cạnh cậu.'),
    ], post: { de: 'Pip holt etwas aus seinem Gefieder: das vierundfünfzigste Stück. „Das hab ich heimlich aufbewahrt. Für den Notfall.“', vi: 'Pip lôi ra một thứ từ đám lông: mảnh thứ năm mươi tư. “Tớ giấu riêng đấy. Phòng khi cần.”' } },
  ],
  55: [
    { pre: [
      l('v', 'Der Wald wird lichter. Die Bäume stehen weiter auseinander.', 'Rừng thưa dần. Cây cối đứng cách xa nhau hơn.'),
      l('p', 'Ich rieche … SALZ! Das Meer!', 'Tớ ngửi thấy … MUỐI! Biển!'),
      l('me', 'Wir sind fast raus!', 'Mình sắp ra khỏi rừng rồi!'),
    ], post: { de: 'Zwischen den Stämmen blitzt Blau auf.', vi: 'Giữa những thân cây lóe lên màu xanh của biển.' } },
    { pre: [
      l('v', 'Aber vorher kommt ein Hang aus losem Geröll.', 'Nhưng trước đó là một con dốc toàn đá vụn.'),
      l('p', 'Rutschig. Natürlich.', 'Trơn. Đương nhiên.'),
      l('me', 'Jeder Stein einzeln.', 'Từng hòn một.'),
    ], post: { de: 'Vestibu prüft jeden Stein, bevor er belastet. Langsam, aber ohne einen Rutscher.', vi: 'Vestibu thử từng hòn trước khi dồn sức. Chậm, nhưng không trượt lần nào.' } },
    { pre: [
      l('v', 'Oben auf dem Hang kann ich ganz kurz auf einem Bein stehen und alles sehen.', 'Trên đỉnh dốc, mình có thể đứng một chân một lát và ngắm toàn cảnh.'),
      l('me', 'Zeig mal!', 'Cho mình xem với!'),
    ], post: { de: 'Unter einem flachen Stein: das fünfundfünfzigste Stück. Und in der Ferne: der Leuchtturm, schon groß.', vi: 'Dưới một hòn đá dẹt: mảnh thứ năm mươi lăm. Và đằng xa: ngọn hải đăng, đã to rõ.' } },
  ],
  56: [
    { pre: [
      l('v', 'Fenna und Bruno sind uns nachgekommen. Sie wollen sich verabschieden.', 'Fenna và Bruno đuổi theo bọn mình. Họ muốn chào tạm biệt.'),
      l('p', 'Schon wieder Abschied. Mein Meerwasser läuft.', 'Lại chia tay. Nước biển của tớ lại chảy.'),
      l('me', 'Wir besuchen euch wieder.', 'Bọn mình sẽ quay lại thăm.'),
    ], post: { de: 'Bruno schenkt eine Dose Kekse. Fenna schenkt einen Fuchsschwanz-Pinsel – für Ilses Lampe.', vi: 'Bruno tặng một hộp bánh quy. Fenna tặng một cây chổi lông đuôi cáo – để lau đèn của Ilse.' } },
    { pre: [
      l('v', 'Ein letztes Waldspiel: Wer am längsten auf einer Wurzel balanciert.', 'Trò chơi cuối trong rừng: Ai giữ thăng bằng trên rễ cây lâu nhất.'),
      l('p', 'Ich gewinne. Ich habe Flügel.', 'Tớ thắng. Tớ có cánh.'),
      l('me', 'Ohne Flügel, Pip!', 'Không dùng cánh, Pip!'),
    ], post: { de: 'Die Fuchskinder gewinnen. Alle lachen.', vi: 'Lũ cáo con thắng. Mọi người cười vang.' } },
    { pre: [
      l('v', 'Danke, Wald. Danke, Freunde.', 'Cảm ơn khu rừng. Cảm ơn các bạn.'),
      l('me', 'Danke für alles!', 'Cảm ơn vì tất cả!'),
    ], post: { de: 'Der Nebelreiher legt euch zum Abschied das sechsundfünfzigste Stück vor die Füße.', vi: 'Chú diệc sương đặt mảnh thứ năm mươi sáu trước chân cả nhóm để từ biệt.' } },
  ],
  57: [
    { pre: [
      l('v', 'Der Waldrand. Vor uns: eine Wiese bis zu den Klippen.', 'Bìa rừng. Trước mặt: một đồng cỏ trải dài tới vách đá.'),
      l('p', 'Und keine Wurzeln! Ich könnte weinen vor Glück.', 'Không còn rễ cây! Tớ muốn khóc vì vui.'),
      l('me', 'Aber Wind.', 'Nhưng có gió.'),
    ], post: { de: 'Auf der offenen Wiese weht ein frischer Seewind.', vi: 'Trên đồng cỏ trống, gió biển thổi mát rượi.' } },
    { pre: [
      l('v', 'Wusel spielt mit dem Gras. Er macht Wellen wie im Meer.', 'Xoáy Nhỏ nghịch cỏ. Nó tạo sóng như ngoài biển.'),
      l('p', 'Angeber. Aber hübsch.', 'Khoe khoang. Nhưng đẹp.'),
      l('me', 'Wir laufen durch die Wellen.', 'Mình đi xuyên qua những con sóng.'),
    ], post: { de: 'Durch das wogende Gras zu gehen ist wie Tanzen.', vi: 'Đi qua cỏ dập dềnh như đang khiêu vũ.' } },
    { pre: [
      l('v', 'Wusel will uns etwas zeigen. In einem Kaninchenbau.', 'Xoáy Nhỏ muốn cho mình xem một thứ. Trong hang thỏ.'),
      l('me', 'Vorsichtig hinknien.', 'Quỳ xuống thật nhẹ.'),
    ], post: { de: 'Die Kaninchen haben das siebenundfünfzigste Stück als Spielzeug benutzt. Sie geben es gegen eine Möhre zurück.', vi: 'Lũ thỏ dùng mảnh thứ năm mươi bảy làm đồ chơi. Chúng trả lại để đổi lấy một củ cà rốt.' } },
  ],
  58: [
    { pre: [
      l('v', 'Ein Brief von Ilse! Er ist ganz kurz: „Der Weg zum Turm ist steil. Ruht euch aus.“', 'Thư của Ilse! Rất ngắn: “Đường lên tháp dốc lắm. Các con nghỉ ngơi đi.”'),
      l('p', 'Ausruhen! Die beste Idee seit Tagen.', 'Nghỉ ngơi! Ý tưởng hay nhất mấy ngày nay.'),
      l('me', 'Ein ruhiger Tag.', 'Một ngày thong thả.'),
    ], post: { de: 'Alle liegen im Gras und schauen in die Wolken.', vi: 'Mọi người nằm trên cỏ ngắm mây.' } },
    { pre: [
      l('v', 'Ruhige Übungen sind auch Übungen. Heute ganz sanft.', 'Bài tập nhẹ nhàng cũng là bài tập. Hôm nay thật nhẹ nhàng.'),
      l('p', 'Sanft kann ich. Sanft ist mein zweiter Vorname.', 'Nhẹ nhàng thì tớ làm được. Nhẹ nhàng là tên đệm của tớ.'),
      l('me', 'Sanft und sicher.', 'Nhẹ nhàng và vững vàng.'),
    ], post: { de: 'Eine Wolke sieht aus wie Vestibu. Eine andere wie ein Fisch. Pip ist zufrieden.', vi: 'Một đám mây trông giống Vestibu. Đám khác giống con cá. Pip mãn nguyện.' } },
    { pre: [
      l('v', 'Morgen gehen wir weiter. Heute sammeln wir Kraft.', 'Mai mình đi tiếp. Hôm nay tích sức.'),
      l('me', 'Kraft sammeln.', 'Tích sức nào.'),
    ], post: { de: 'Beim Aufstehen findet Vestibu im Gras das achtundfünfzigste Stück. Es lag die ganze Zeit neben ihm.', vi: 'Lúc đứng dậy, Vestibu thấy mảnh thứ năm mươi tám trong cỏ. Nó đã nằm cạnh cậu suốt.' } },
  ],
  59: [
    { pre: [
      l('v', 'Hinter der Wiese beginnen die Klippen. Und eine lange Treppe hinunter zum Strand.', 'Sau đồng cỏ là vách đá. Và một cầu thang dài xuống bãi biển.'),
      l('p', 'Treppen runter. Meine Knie tun schon beim Hinsehen weh. Ich habe keine Knie.', 'Xuống cầu thang. Nhìn thôi đã đau gối. Mà tớ làm gì có gối.'),
      l('me', 'Stufe für Stufe.', 'Từng bậc một.'),
    ], post: { de: 'Zweihundert Stufen. Vestibu zählt jede einzelne.', vi: 'Hai trăm bậc. Vestibu đếm từng bậc.' } },
    { pre: [
      l('v', 'Auf halber Höhe ist eine Stufe abgebrochen.', 'Nửa đường có một bậc bị vỡ.'),
      l('p', 'Wusel, Brücke aus Wind?', 'Xoáy Nhỏ, cầu gió nhé?'),
      l('me', 'Wie am Klippenpfad!', 'Như ở đường mép vách!'),
    ], post: { de: 'Wusel hält die Luft still. Vestibu steigt sicher hinüber – diesmal ohne zu zögern.', vi: 'Xoáy Nhỏ giữ không khí thật yên. Vestibu bước qua vững vàng – lần này không chút do dự.' } },
    { pre: [
      l('v', 'Unten am Strand. Der Leuchtturm steht auf einer Insel davor. Mit einem Damm verbunden – bei Ebbe.', 'Đã xuống bãi biển. Hải đăng đứng trên một hòn đảo nhỏ phía trước. Nối bằng một con đê – khi thủy triều rút.'),
      l('me', 'Wann ist Ebbe?', 'Khi nào triều rút?'),
    ], post: { de: 'Morgen früh, sagt ein Krebs. Am Strand liegt das neunundfünfzigste Stück.', vi: 'Sáng mai, một chú cua bảo vậy. Trên bãi cát là mảnh thứ năm mươi chín.' } },
  ],
  60: [
    { pre: [
      l('v', 'Sechzig Tage! Das Wasser zieht sich zurück.', 'Sáu mươi ngày! Nước đang rút.'),
      l('p', 'Der Damm! Ich sehe die Steine!', 'Con đê! Tớ thấy những hòn đá rồi!'),
      l('me', 'Los geht’s!', 'Đi thôi!'),
    ], post: { de: 'Der Damm ist schmal, nass und voller Algen.', vi: 'Con đê hẹp, ướt và đầy rong rêu.' } },
    { pre: [
      l('v', 'Algen sind glitschiger als alles bisher. Fuß ganz flach aufsetzen.', 'Rong rêu trơn hơn mọi thứ trước đây. Đặt chân thật phẳng.'),
      l('p', 'Ich fliege. Ich bin doch nicht verrückt.', 'Tớ bay. Tớ đâu có điên.'),
      l('me', 'Wir gehen. Sicher.', 'Mình đi. Thật vững.'),
    ], post: { de: 'Schritt für Schritt über den Damm. Hinter euch kommt die Flut schon zurück.', vi: 'Từng bước qua con đê. Phía sau, thủy triều đã bắt đầu lên.' } },
    { pre: [
      l('v', 'Die letzten Meter! Ruhig bleiben, nicht hetzen.', 'Mấy mét cuối! Bình tĩnh, đừng vội.'),
      l('me', 'Ruhig ist schnell genug.', 'Bình tĩnh là đủ nhanh rồi.'),
    ], post: { de: 'Geschafft! Am Fuß des Leuchtturms öffnet sich eine Tür. Eine alte Frau lächelt: „Da seid ihr ja endlich.“ In ihrer Hand: das sechzigste Stück.', vi: 'Tới nơi rồi! Dưới chân hải đăng, một cánh cửa mở ra. Một bà cụ mỉm cười: “Cuối cùng các con cũng tới.” Trong tay bà: mảnh thứ sáu mươi.' } },
  ],
}
