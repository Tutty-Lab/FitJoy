import type { SessionScene, Who, Line } from './storyDialog'

const l = (who: Who, de: string, vi: string): Line => ({ who, de, vi })

// Days 8–30: the harbor wakes up. Ilse's letters arrive, the path to the lighthouse is found –
// it leads through the forest. A little whirlwind keeps snatching pieces away.
export const harborDialog: Record<number, SessionScene[]> = {
  8: [
    { pre: [
      l('v', 'Ilse … Pip, kennst du eine Ilse?', 'Ilse … Pip, cậu có biết ai tên Ilse không?'),
      l('me', 'Dann gehen wir zu ihr!', 'Vậy mình tới chỗ bà ấy!'),
      l('v', 'Der Leuchtturm ist weit. Erst muss ich lernen, sicher zu gehen – nicht nur zu stehen.', 'Hải đăng xa lắm. Mình phải học đi cho vững trước – không chỉ đứng thôi.'),
    ], post: { de: 'Auf der Rückseite von Ilses Brief entdeckt Vestibu eine Karte – mit einem roten Kreuz mitten im Hafen.', vi: 'Mặt sau lá thư của Ilse là một tấm bản đồ – có dấu gạch đỏ ngay giữa bến cảng.' } },
    { pre: [
      l('v', 'Das Kreuz ist beim alten Fischmarkt.', 'Dấu gạch nằm ở chợ cá cũ.'),
    ], post: { de: 'Der Markt ist leer, die Stände umgekippt. Unter einer Kiste schimmert es.', vi: 'Chợ vắng tanh, các sạp đổ nghiêng. Dưới một cái thùng có ánh lấp lánh.' } },
    { pre: [
      l('v', 'Die Kiste ist schwer. Ich hebe sie langsam an – ganz aus der Mitte.', 'Thùng nặng lắm. Mình nhấc từ từ – giữ thăng bằng từ giữa người.'),
      l('me', 'Ich zähle mit dir.', 'Mình đếm cùng bạn.'),
    ], post: { de: 'Das achte Stück! Doch kaum liegt es frei, wirbelt ein kleiner Windstoß Sand auf – und das Stück rollt davon.', vi: 'Mảnh thứ tám! Nhưng vừa lộ ra, một luồng gió xoáy nhỏ cuốn cát lên – và mảnh đá lăn mất.' } },
  ],
  9: [
    { pre: [
      l('p', 'Hast du das gesehen? Der Wind hat sich gedreht wie ein Kreisel!', 'Cậu thấy không? Gió xoay tròn như con quay!'),
      l('v', 'Ein Wirbelwind. Ein ganz kleiner. Und er hat unser Stück.', 'Một cơn gió xoáy. Rất nhỏ thôi. Và nó lấy mảnh đá của mình.'),
      l('me', 'Wo ist er hin?', 'Nó đi đâu rồi?'),
    ], post: { de: 'Spuren im Sand führen im Kreis um den Markt. Mal links, mal rechts. Wer so läuft, weiß nicht, wohin.', vi: 'Dấu vết trên cát chạy vòng quanh chợ. Lúc trái, lúc phải. Ai đi như vậy thì chẳng biết mình đi đâu.' } },
    { pre: [
      l('v', 'Ich glaube, der Wirbel ist durcheinander – so wie die Insel.', 'Mình nghĩ cơn xoáy đang rối – giống hòn đảo vậy.'),
      l('p', 'Durcheinander oder frech. Ich tippe auf frech.', 'Rối hay láu cá thì chưa biết. Tớ đoán là láu cá.'),
      l('me', 'Wir finden es heraus.', 'Mình sẽ tìm hiểu.'),
    ], post: { de: 'Hinter dem Fischstand wird es still. Der Wirbel liegt da, ganz klein, und dreht sich müde um das Stück.', vi: 'Sau sạp cá yên ắng hẳn. Cơn xoáy nằm đó, bé xíu, mệt mỏi xoay quanh mảnh đá.' } },
    { pre: [
      l('v', 'Wenn ich ruhig bleibe, erschrecke ich ihn nicht. Ganz still stehen …', 'Nếu mình bình tĩnh, nó sẽ không sợ. Đứng thật yên …'),
      l('me', 'Still wie ein Leuchtturm.', 'Yên như ngọn hải đăng.'),
    ], post: { de: 'Der Wirbel lässt das Stück liegen und huscht davon. Pip ruft ihm nach: „Wir nennen dich Wusel!“', vi: 'Cơn xoáy bỏ mảnh đá lại rồi vụt đi. Pip gọi với theo: “Bọn tớ gọi cậu là Xoáy Nhỏ nhé!”' } },
  ],
  10: [
    { pre: [
      l('v', 'Zehn Tage! Und schau mal, die Fischer kommen zurück.', 'Mười ngày rồi! Nhìn kìa, các ngư dân đã quay lại.'),
      l('me', 'Was brauchen sie?', 'Họ cần gì?'),
      l('v', 'Ihre Netze sind zerrissen. Flicken braucht ruhige Hände.', 'Lưới của họ rách hết. Vá lưới cần đôi tay vững.'),
    ], post: { de: 'Masche für Masche wird das erste Netz wieder ganz.', vi: 'Từng mắt lưới một, tấm lưới đầu tiên đã lành lại.' } },
    { pre: [
      l('v', 'Das zweite Netz hängt hoch am Mast.', 'Tấm lưới thứ hai treo cao trên cột buồm.'),
      l('p', 'Hoch ist meine Spezialität. Aber Knoten nicht. Knoten sind gemein.', 'Trên cao là sở trường của tớ. Nhưng nút thắt thì không. Nút thắt ác lắm.'),
      l('me', 'Ich halte, du knotest, Vestibu.', 'Mình giữ, Vestibu thắt nút.'),
    ], post: { de: 'Das Netz ist geflickt. Die Fischer winken und werfen Pip einen Fisch zu.', vi: 'Lưới đã vá xong. Ngư dân vẫy tay và ném cho Pip một con cá.' } },
    { pre: [
      l('v', 'Die Fischer erzählen von Ilse. Sie war jeden Tag am Hafen – bis zum Sturm.', 'Ngư dân kể về Ilse. Ngày nào bà cũng ra bến – cho tới khi bão tới.'),
      l('me', 'Und seitdem?', 'Còn từ đó?'),
      l('v', 'Seitdem ist der Weg zum Leuchtturm verschwunden.', 'Từ đó con đường tới hải đăng biến mất.'),
    ], post: { de: 'Im ersten Fang zappelt kein Fisch, sondern das zehnte Stück. Pip ist enttäuscht. Alle anderen jubeln.', vi: 'Mẻ lưới đầu không có cá, mà là mảnh đá thứ mười. Pip thất vọng. Mọi người khác reo hò.' } },
  ],
  11: [
    { pre: [
      l('p', 'Post! Post! Ein Brief für die Wackelbeine!', 'Thư! Thư! Có thư cho hai cái chân run!'),
      l('v', 'Von Ilse! Sie schreibt: „Der Weg ist nicht weg. Er schläft. Weckt ihn mit Schritten.“', 'Của Ilse! Bà viết: “Con đường không mất. Nó đang ngủ. Hãy đánh thức nó bằng bước chân.”'),
      l('me', 'Was heißt das?', 'Nghĩa là sao?'),
    ], post: { de: 'Als Vestibu fest auftritt, leuchtet ein Pflasterstein kurz auf.', vi: 'Khi Vestibu bước thật chắc, một viên đá lát đường bỗng sáng lên.' } },
    { pre: [
      l('v', 'Jeder sichere Schritt weckt einen Stein! Aber nur, wenn ich nicht wackle.', 'Mỗi bước vững đánh thức một viên đá! Nhưng chỉ khi mình không chao.'),
      l('p', 'Also kein Hüpfen? Schade.', 'Vậy là không được nhảy à? Tiếc ghê.'),
      l('me', 'Langsam ist schneller.', 'Chậm mà chắc.'),
    ], post: { de: 'Eine leuchtende Spur führt vom Markt bis zur Hafenmauer.', vi: 'Một vệt sáng chạy từ chợ tới tận tường bến cảng.' } },
    { pre: [
      l('v', 'Die Spur endet an der Mauer. Dahinter ist … nichts. Nur Nebel.', 'Vệt sáng dừng ở bức tường. Phía sau là … không có gì. Chỉ có sương.'),
      l('me', 'Morgen gehen wir weiter.', 'Mai mình đi tiếp.'),
    ], post: { de: 'In einer Ritze der Mauer steckt das elfte Stück – und ein Zettel: „Gut gemacht. – I.“', vi: 'Trong khe tường có mảnh thứ mười một – kèm mảnh giấy: “Giỏi lắm. – I.”' } },
  ],
  12: [
    { pre: [
      l('v', 'Ilse beobachtet uns. Aber von wo?', 'Ilse đang dõi theo mình. Nhưng từ đâu?'),
      l('p', 'Vom Leuchtturm natürlich. Sie hat ein Fernrohr. Ein großes.', 'Từ hải đăng chứ đâu. Bà có ống nhòm. To lắm.'),
      l('me', 'Dann winken wir!', 'Vậy mình vẫy tay!'),
    ], post: { de: 'Weit hinten im Nebel blinkt dreimal ein schwaches Licht. Ein Gruß!', vi: 'Tít xa trong sương, một ánh sáng yếu ớt nháy ba lần. Lời chào!' } },
    { pre: [
      l('v', 'Ihr Licht ist so schwach. Ohne den Stein hat die Lampe keine Kraft.', 'Ánh đèn yếu quá. Không có hòn đá, đèn chẳng còn sức.'),
      l('p', 'Wie ich ohne Frühstück.', 'Như tớ khi chưa ăn sáng.'),
      l('me', 'Wir bringen ihr die Kraft.', 'Mình sẽ mang sức mạnh tới cho bà.'),
    ], post: { de: 'Vestibu baut aus Muscheln einen Spiegel und schickt das Licht zurück: drei Blinker.', vi: 'Vestibu làm một chiếc gương bằng vỏ sò và gửi ánh sáng đáp lại: ba lần nháy.' } },
    { pre: [
      l('v', 'Den Spiegel muss ich ganz ruhig halten, sonst trifft das Licht nicht.', 'Mình phải giữ gương thật yên, không thì ánh sáng không tới nơi.'),
      l('me', 'Ich halte mit.', 'Mình giữ cùng.'),
    ], post: { de: 'Antwort aus dem Nebel: ein langes Leuchten. Dann fällt etwas vom Himmel – Wusel bringt das zwölfte Stück!', vi: 'Từ trong sương đáp lại: một vệt sáng dài. Rồi có gì đó rơi từ trên trời – Xoáy Nhỏ mang tới mảnh thứ mười hai!' } },
  ],
  13: [
    { pre: [
      l('p', 'Moment. Der Wirbel bringt uns was? Der Dieb?', 'Khoan. Cơn xoáy mang đồ tới cho mình à? Tên trộm ấy?'),
      l('v', 'Vielleicht war er nie ein Dieb. Vielleicht wollte er nur mitspielen.', 'Có lẽ nó chưa bao giờ là trộm. Có lẽ nó chỉ muốn chơi cùng.'),
      l('me', 'Hallo, Wusel!', 'Chào Xoáy Nhỏ!'),
    ], post: { de: 'Wusel dreht eine kleine, fröhliche Runde um alle drei. Er wirbelt dabei kein bisschen Sand auf.', vi: 'Xoáy Nhỏ xoay một vòng vui vẻ quanh cả ba. Lần này không tung lên chút cát nào.' } },
    { pre: [
      l('v', 'Wenn Wusel ruhig ist, ist er sanft. Wie eine Brise.', 'Khi Xoáy Nhỏ bình tĩnh, nó thật dịu dàng. Như một làn gió nhẹ.'),
      l('p', 'Und wenn nicht, klaut er Hüte. Ich kenne das.', 'Còn không thì nó cuốn mũ người ta. Tớ biết mà.'),
      l('me', 'Wir zeigen ihm, wie man ruhig bleibt.', 'Mình chỉ cho nó cách giữ bình tĩnh.'),
    ], post: { de: 'Vestibu atmet langsam, Wusel dreht sich langsamer. Ein, aus. Ein, aus.', vi: 'Vestibu thở chậm, Xoáy Nhỏ cũng xoay chậm lại. Hít vào, thở ra. Hít vào, thở ra.' } },
    { pre: [
      l('v', 'Noch eine Runde zusammen atmen. Für Wusel.', 'Thêm một lượt thở cùng nhau. Vì Xoáy Nhỏ.'),
      l('me', 'Für Wusel!', 'Vì Xoáy Nhỏ!'),
    ], post: { de: 'Wusel legt sich als warme Brise in die Segel. Und er hat noch ein Geschenk: das dreizehnte Stück.', vi: 'Xoáy Nhỏ nằm thành làn gió ấm trong cánh buồm. Và nó còn một món quà: mảnh thứ mười ba.' } },
  ],
  14: [
    { pre: [
      l('v', 'Zwei Wochen! Die Insel schwankt schon viel weniger.', 'Hai tuần rồi! Hòn đảo đã bớt chao nhiều lắm.'),
      l('p', 'Ich kann wieder auf einem Bein auf dem Poller stehen. Ohne Flattern!', 'Tớ lại đứng một chân trên cọc buộc thuyền được rồi. Không cần vỗ cánh!'),
      l('me', 'Ich auch – fast.', 'Mình cũng vậy – gần như thế.'),
    ], post: { de: 'Im Hafen wird gefeiert. Jemand hängt Lampions auf.', vi: 'Bến cảng mở tiệc. Có người treo đèn lồng lên.' } },
    { pre: [
      l('v', 'Bei einem Fest wird getanzt. Tanzen heißt: das Gewicht verlagern.', 'Có tiệc là có nhảy. Nhảy nghĩa là chuyển trọng tâm.'),
      l('me', 'Ich wiege mich mit.', 'Mình đung đưa cùng.'),
    ], post: { de: 'Alle wiegen sich im Takt. Niemand fällt. Das hätte vor zwei Wochen niemand geglaubt.', vi: 'Mọi người đung đưa theo nhịp. Không ai ngã. Hai tuần trước chẳng ai tin nổi.' } },
    { pre: [
      l('v', 'Das letzte Lampion hängt schief. Ich richte es – eine Hand fest an der Mauer.', 'Chiếc đèn lồng cuối còn treo lệch. Mình chỉnh lại – một tay vịn chắc vào tường.'),
      l('me', 'Vorsichtig!', 'Cẩn thận nhé!'),
    ], post: { de: 'Im letzten Lampion klappert das vierzehnte Stück. Ilses Licht im Nebel blinkt zweimal: Glückwunsch.', vi: 'Trong chiếc đèn lồng cuối có mảnh thứ mười bốn. Ánh đèn của Ilse nháy hai lần: chúc mừng.' } },
  ],
  15: [
    { pre: [
      l('v', 'Heute ist der Nebel dünner. Ich sehe einen Weg hinter der Mauer!', 'Hôm nay sương mỏng hơn. Mình thấy có lối đi sau bức tường!'),
      l('p', 'Das ist der Klippenpfad. Schmal. Sehr schmal.', 'Đó là đường mép vách đá. Hẹp. Hẹp lắm.'),
      l('me', 'Schmal schaffen wir.', 'Hẹp thì mình vẫn đi được.'),
    ], post: { de: 'Der Pfad ist so breit wie ein Fuß. Rechts der Fels, links das Meer.', vi: 'Lối đi chỉ rộng bằng một bàn chân. Bên phải là vách đá, bên trái là biển.' } },
    { pre: [
      l('v', 'Ein Fuß vor den anderen. Ferse an Zehen. Blick nach vorn.', 'Chân này trước chân kia. Gót sát mũi chân. Mắt nhìn thẳng.'),
      l('p', 'Nicht nach unten schauen! … Ich hab nach unten geschaut. Hoch ist das.', 'Đừng nhìn xuống! … Tớ nhìn xuống rồi. Cao thật.'),
      l('me', 'Blick nach vorn, Pip.', 'Nhìn thẳng thôi, Pip.'),
    ], post: { de: 'Auf halber Strecke ist eine Lücke im Pfad. Zu breit für einen Schritt.', vi: 'Giữa đường có một khoảng hở. Quá rộng để bước qua.' } },
    { pre: [
      l('v', 'Wusel? Kannst du uns eine Brücke aus Wind bauen?', 'Xoáy Nhỏ ơi? Cậu làm được cây cầu gió cho bọn mình không?'),
      l('me', 'Wir vertrauen dir!', 'Bọn mình tin cậu!'),
    ], post: { de: 'Wusel hält die Luft ganz still, und Vestibu steigt sicher hinüber. Auf der anderen Seite: das fünfzehnte Stück.', vi: 'Xoáy Nhỏ giữ không khí thật yên, và Vestibu bước qua an toàn. Bên kia là mảnh thứ mười lăm.' } },
  ],
  16: [
    { pre: [
      l('v', 'Der Klippenpfad führt zu einer Höhle.', 'Đường mép vách dẫn tới một cái hang.'),
      l('p', 'Höhlen sind dunkel. Dunkel ist nichts für Möwen.', 'Hang thì tối. Tối không hợp với hải âu.'),
      l('me', 'Wir haben die leuchtende Feder!', 'Mình có chiếc lông vũ phát sáng mà!'),
    ], post: { de: 'Die blaue Feder leuchtet. An den Wänden: Muschelzeichen, Hunderte davon.', vi: 'Chiếc lông xanh sáng lên. Trên vách hang: những dấu vỏ sò, hàng trăm cái.' } },
    { pre: [
      l('v', 'Hier hat Ilse früher gewartet, wenn Sturm war. Hier liegt ihre Decke.', 'Ngày xưa Ilse trú bão ở đây. Đây là tấm chăn của bà.'),
      l('me', 'Es gibt etwas anderes.', 'Có thứ khác kìa.'),
    ], post: { de: 'In einer Nische steht eine kleine Holzkiste mit einem Schloss in Muschelform.', vi: 'Trong một hốc tường có chiếc hộp gỗ nhỏ, ổ khóa hình vỏ sò.' } },
    { pre: [
      l('v', 'Die Postkarte! Das Zeichen passt genau ins Schloss.', 'Tấm bưu thiếp! Dấu vỏ sò vừa khít ổ khóa.'),
      l('me', 'Mach sie auf!', 'Mở ra đi!'),
    ], post: { de: 'In der Kiste: ein Foto. Ilse, jung, neben dem leuchtenden Stein – und daneben ein kleiner Vestibu.', vi: 'Trong hộp: một tấm ảnh. Ilse thời trẻ, đứng cạnh hòn đá phát sáng – bên cạnh là một Vestibu bé xíu.' } },
  ],
  17: [
    { pre: [
      l('p', 'Das bist DU auf dem Foto, Vestibu!', 'Người trong ảnh là CẬU đấy, Vestibu!'),
      l('v', 'Ich … ich erinnere mich nicht. Ich war damals noch ganz klein.', 'Mình … mình không nhớ. Hồi đó mình còn bé lắm.'),
      l('me', 'Ilse kennt dich also.', 'Vậy là Ilse biết bạn.'),
    ], post: { de: 'Vestibu schaut lange auf das Foto. Dann lächelt er: „Sie wartet auf uns. Schon lange.“', vi: 'Vestibu nhìn tấm ảnh rất lâu. Rồi mỉm cười: “Bà ấy đang chờ bọn mình. Lâu lắm rồi.”' } },
    { pre: [
      l('v', 'Auf dem Foto steht der Stein auf einem Sockel. Wo ist der Sockel jetzt?', 'Trong ảnh, hòn đá đặt trên một cái bệ. Giờ cái bệ ở đâu?'),
      l('p', 'Den hab ich gesehen! Am Hafenbecken. Umgekippt.', 'Tớ thấy rồi! Ở bể cảng. Đổ nghiêng.'),
      l('me', 'Richten wir ihn auf.', 'Mình dựng nó lên.'),
    ], post: { de: 'Der Sockel ist riesig. Allein schafft das keiner.', vi: 'Cái bệ to khổng lồ. Một mình thì chẳng ai làm nổi.' } },
    { pre: [
      l('v', 'Die Fischer helfen! Alle stellen sich breitbeinig hin und schieben gemeinsam.', 'Ngư dân tới giúp! Ai cũng đứng chân rộng và cùng đẩy.'),
      l('me', 'Auf drei!', 'Đếm tới ba!'),
    ], post: { de: 'Der Sockel steht. Vestibu legt alle Stücke darauf – und sie beginnen zu summen. Siebzehn.', vi: 'Cái bệ đã đứng. Vestibu đặt hết các mảnh lên – chúng bắt đầu ngân nhẹ. Mười bảy mảnh.' } },
  ],
  18: [
    { pre: [
      l('v', 'Hörst du das Summen? Die Stücke wollen zusammen sein.', 'Bạn nghe tiếng ngân không? Các mảnh đá muốn ở bên nhau.'),
      l('p', 'Wie Möwen im Schwarm.', 'Như hải âu bay thành đàn.'),
      l('me', 'Wo sind die anderen?', 'Còn những mảnh khác ở đâu?'),
    ], post: { de: 'Das Summen wird lauter, wenn Vestibu zum Leuchtturm schaut. Und leiser, wenn er zum Meer schaut.', vi: 'Tiếng ngân to hơn khi Vestibu nhìn về hải đăng. Và nhỏ đi khi nhìn ra biển.' } },
    { pre: [
      l('v', 'Der Stein ist wie ein Kompass. Ich muss mich langsam drehen und genau hinhören.', 'Hòn đá như la bàn vậy. Mình phải xoay thật chậm và lắng nghe kỹ.'),
      l('p', 'Drehen ohne Schwindel? Viel Glück.', 'Xoay mà không chóng mặt? Chúc may mắn.'),
      l('me', 'Ganz langsam.', 'Thật chậm thôi.'),
    ], post: { de: 'Am lautesten summt es Richtung Leuchtturm. Fast alle Stücke liegen auf dem Weg dorthin.', vi: 'Tiếng ngân to nhất ở hướng hải đăng. Gần như mọi mảnh đều nằm trên đường tới đó.' } },
    { pre: [
      l('v', 'Aber eines summt ganz nah. Unter dem Steg!', 'Nhưng có một mảnh ngân rất gần. Dưới cầu tàu!'),
      l('me', 'Holen wir es.', 'Lấy nó thôi.'),
    ], post: { de: 'Zwischen zwei Pfählen klemmt das achtzehnte Stück. Der Hafen ist fast ganz still.', vi: 'Kẹt giữa hai cột là mảnh thứ mười tám. Bến cảng gần như đứng yên hẳn.' } },
  ],
  19: [
    { pre: [
      l('p', 'Schlechte Nachricht. Wolken. Dicke. Schwarze.', 'Tin xấu. Mây. Dày. Đen.'),
      l('v', 'Ein Gewitter. Wir müssen die Boote sichern.', 'Một cơn dông. Mình phải buộc chặt thuyền.'),
      l('me', 'Schnell, aber sicher!', 'Nhanh nhưng phải vững!'),
    ], post: { de: 'Ein Boot nach dem anderen wird festgezurrt. Der Regen beginnt.', vi: 'Từng chiếc thuyền được buộc chặt. Mưa bắt đầu rơi.' } },
    { pre: [
      l('v', 'Der Steg ist nass und rutschig. Kleine Schritte, Knie weich.', 'Cầu tàu ướt và trơn. Bước nhỏ, gối mềm.'),
      l('p', 'Wusel dreht durch! Er hat Angst vor Donner.', 'Xoáy Nhỏ loạn lên rồi! Nó sợ sấm.'),
      l('me', 'Wir beruhigen ihn.', 'Mình trấn an nó.'),
    ], post: { de: 'Vestibu atmet ruhig, so wie sie es geübt haben. Wusel kuschelt sich zitternd an ihn.', vi: 'Vestibu thở đều, đúng như đã tập. Xoáy Nhỏ run rẩy nép vào người cậu.' } },
    { pre: [
      l('v', 'Bleiben wir bei ihm, bis das Gewitter vorbei ist.', 'Mình ở cạnh nó tới khi dông tan.'),
      l('me', 'Wir sind hier, Wusel.', 'Bọn mình ở đây, Xoáy Nhỏ.'),
    ], post: { de: 'Das Gewitter zieht ab. Kein Boot ist verloren. Und der Blitz hat einen Felsen gespalten – darin: das neunzehnte Stück.', vi: 'Cơn dông qua đi. Không mất chiếc thuyền nào. Tia sét đã chẻ đôi một tảng đá – bên trong là mảnh thứ mười chín.' } },
  ],
  20: [
    { pre: [
      l('v', 'Nach dem Gewitter ist alles klar. Ich kann bis zum Wald sehen!', 'Sau cơn dông mọi thứ trong vắt. Mình nhìn được tới tận khu rừng!'),
      l('me', 'Liegt der Leuchtturm hinter dem Wald?', 'Hải đăng nằm sau khu rừng à?'),
      l('v', 'Ja. Der einzige Weg führt hindurch.', 'Đúng. Con đường duy nhất đi xuyên qua nó.'),
    ], post: { de: 'Vestibu zeichnet den Weg auf Ilses Karte nach. Noch zehn Tage bis zum Waldrand.', vi: 'Vestibu vẽ lại đường đi lên bản đồ của Ilse. Còn mười ngày nữa là tới bìa rừng.' } },
    { pre: [
      l('v', 'Für den Wald brauche ich Ausdauer. Heute üben wir besonders ruhig.', 'Vào rừng cần sức bền. Hôm nay mình tập thật đều đặn.'),
    ], post: { de: 'Pip hält die Pose stolz eine ganze Minute. Dann kippt er um. Alle lachen – Pip am lautesten.', vi: 'Pip tự hào giữ dáng cả một phút. Rồi ngã lăn ra. Ai cũng cười – Pip cười to nhất.' } },
    { pre: [
      l('v', 'Zwanzig Tage. Ich bin stolz auf dich.', 'Hai mươi ngày. Mình tự hào về bạn.'),
      l('me', 'Und ich auf dich.', 'Mình cũng tự hào về bạn.'),
    ], post: { de: 'Ein Paket kommt mit dem Boot: von Ilse. Darin ein Wanderstab und das zwanzigste Stück.', vi: 'Một bưu kiện tới bằng thuyền: của Ilse. Bên trong là cây gậy đi đường và mảnh thứ hai mươi.' } },
  ],
  21: [
    { pre: [
      l('v', 'Ein Wanderstab mit Muschelgriff. Ilse denkt an alles.', 'Gậy đi đường có tay cầm vỏ sò. Ilse chu đáo thật.'),
      l('me', 'Wir schnitzen dir einen.', 'Bọn mình khắc cho cậu một cây.'),
    ], post: { de: 'Aus Treibholz entsteht ein winziger Stab. Pip trägt ihn wie eine Krone.', vi: 'Từ gỗ trôi dạt thành một cây gậy tí hon. Pip đeo nó như vương miện.' } },
    { pre: [
      l('v', 'Im Brief steht: „Der Wald prüft, ob ihr zuhört.“ Was meint sie?', 'Trong thư viết: “Khu rừng sẽ thử xem các con có biết lắng nghe không.” Ý bà là gì?'),
      l('p', 'Zuhören kann ich! … Was hast du gesagt?', 'Lắng nghe thì tớ giỏi! … Cậu vừa nói gì?'),
      l('me', 'Wir üben es.', 'Mình tập thôi.'),
    ], post: { de: 'Mit geschlossenen Augen hören alle: Wellen, Wind, ein Glöckchen. Und ein leises Summen von links.', vi: 'Nhắm mắt lại, mọi người nghe: sóng, gió, tiếng chuông nhỏ. Và một tiếng ngân khẽ từ bên trái.' } },
    { pre: [
      l('v', 'Das Summen! Ohne hinzusehen finde ich es. Augen zu, ganz ruhig stehen.', 'Tiếng ngân! Không cần nhìn mình cũng tìm được. Nhắm mắt, đứng thật yên.'),
      l('me', 'Ich höre es auch.', 'Mình cũng nghe thấy.'),
    ], post: { de: 'In einem Blumentopf vor dem Hafenbüro: das einundzwanzigste Stück. Drei Wochen geschafft!', vi: 'Trong chậu hoa trước văn phòng bến cảng: mảnh thứ hai mươi mốt. Ba tuần đã xong!' } },
  ],
  22: [
    { pre: [
      l('p', 'Heute bin ich der Lehrer. Lektion eins: auf einem Bein stehen. Wie eine Möwe.', 'Hôm nay tớ làm thầy. Bài một: đứng một chân. Như hải âu.'),
      l('v', 'Und Lektion zwei?', 'Còn bài hai?'),
      l('me', 'Bleiben wir bei Lektion eins.', 'Mình học bài một thôi.'),
    ], post: { de: 'Pip ist ein strenger Lehrer. Aber ein guter.', vi: 'Pip là ông thầy khó tính. Nhưng dạy giỏi.' } },
    { pre: [
      l('v', 'Pip, warum hilfst du uns eigentlich?', 'Pip, sao cậu lại giúp bọn mình vậy?'),
      l('p', 'Weil … seit dem Sturm ist mein Nest weg. Und ihr seid jetzt mein Schwarm.', 'Vì … từ sau cơn bão, tổ của tớ mất rồi. Giờ các cậu là đàn của tớ.'),
      l('me', 'Wir bauen dir ein neues Nest.', 'Bọn mình làm cho cậu tổ mới.'),
    ], post: { de: 'Ganz oben auf dem Hafenkran sammeln sie Zweige, Seil und Federn.', vi: 'Trên đỉnh cần cẩu bến cảng, cả nhóm gom cành cây, dây thừng và lông vũ.' } },
    { pre: [
      l('v', 'Das Nest kommt nach oben. Pip fliegt, ich reiche ihm die Zweige – sicher vom Boden aus.', 'Tổ đặt trên cao. Pip bay lên, mình đứng vững dưới đất đưa cành cho cậu ấy.'),
      l('me', 'Ich reiche mit.', 'Mình đưa cùng.'),
    ], post: { de: 'Pips neues Nest ist fertig. Er legt sein liebstes Glitzerding hinein: das zweiundzwanzigste Stück. „Leihweise“, sagt er.', vi: 'Tổ mới của Pip xong rồi. Nó đặt món đồ lấp lánh yêu thích nhất vào: mảnh thứ hai mươi hai. “Cho mượn thôi đấy”, nó nói.' } },
  ],
  23: [
    { pre: [
      l('v', 'Der Hafen hat ein Problem: die Brücke zur Werft ist eingestürzt.', 'Bến cảng gặp chuyện: cây cầu tới xưởng đóng thuyền sập rồi.'),
    ], post: { de: 'Ein einziger Balken liegt noch über dem Wasser. Schmal wie ein Ast.', vi: 'Chỉ còn một thanh xà vắt ngang mặt nước. Hẹp như một cành cây.' } },
    { pre: [
      l('v', 'Über den Balken bringe ich ein Seil zur anderen Seite. Arme seitlich, Blick nach vorn.', 'Mình đi qua thanh xà để mang dây sang bờ bên kia. Dang tay, nhìn thẳng.'),
      l('p', 'Ich fliege nebenher. Für die Moral.', 'Tớ bay kèm bên cạnh. Để cổ vũ tinh thần.'),
      l('me', 'Du schaffst das!', 'Bạn làm được!'),
    ], post: { de: 'Das Seil ist drüben. Jetzt können die Fischer Bretter hinüberziehen.', vi: 'Dây đã sang bờ. Giờ ngư dân có thể kéo ván qua.' } },
    { pre: [
      l('v', 'Brett für Brett wächst die Brücke. Ich prüfe jedes mit einem Schritt.', 'Từng tấm ván, cây cầu dài dần. Mình thử từng tấm bằng một bước chân.'),
      l('me', 'Sicher? Weiter!', 'Chắc chưa? Tiếp nào!'),
    ], post: { de: 'Die Werft ist wieder erreichbar. Der alte Bootsbauer überreicht das dreiundzwanzigste Stück.', vi: 'Đã tới được xưởng thuyền. Ông thợ đóng thuyền già trao mảnh thứ hai mươi ba.' } },
  ],
  24: [
    { pre: [
      l('v', 'Der Bootsbauer hat etwas gesagt: „Ilse wartet nicht nur auf den Stein. Sie wartet auf jemanden.“', 'Ông thợ thuyền nói: “Ilse không chỉ chờ hòn đá. Bà đang chờ một người.”'),
      l('me', 'Auf wen denn?', 'Vậy là chờ ai?'),
    ], post: { de: 'Der Bootsbauer lächelt nur und zeigt auf dich.', vi: 'Ông thợ thuyền chỉ mỉm cười và chỉ tay về phía bạn.' } },
    { pre: [
      l('v', 'Die leere Postkarte … vielleicht war sie für dich bestimmt.', 'Tấm bưu thiếp trắng … có lẽ nó dành cho bạn.'),
      l('p', 'Eine Einladung! Ich liebe Einladungen. Meistens gibt es Essen.', 'Một lời mời! Tớ mê lời mời lắm. Thường là có đồ ăn.'),
      l('me', 'Dann nehme ich sie an.', 'Vậy mình nhận lời.'),
    ], post: { de: 'Vestibu schreibt deinen Namen auf die Karte. Sie beginnt ganz leicht zu leuchten.', vi: 'Vestibu viết tên bạn lên tấm thiệp. Nó bắt đầu sáng nhẹ.' } },
    { pre: [
      l('v', 'Die Karte zeigt jetzt ein Bild: ein Tor aus Wurzeln am Waldrand.', 'Tấm thiệp giờ hiện ra một hình: cánh cổng bằng rễ cây ở bìa rừng.'),
      l('me', 'Da müssen wir hin.', 'Mình phải tới đó.'),
    ], post: { de: 'Hinter dem Bild versteckt, wie ein Wasserzeichen: das vierundzwanzigste Stück erscheint auf deiner Handfläche.', vi: 'Như một hình chìm sau tấm ảnh: mảnh thứ hai mươi bốn hiện ra trên lòng bàn tay bạn.' } },
  ],
  25: [
    { pre: [
      l('p', 'Abschiedsfest! Der Hafen will euch verabschieden.', 'Tiệc chia tay! Cả bến cảng muốn tiễn các cậu.'),
      l('v', 'Noch nicht, Pip. Fünf Tage haben wir noch.', 'Chưa đâu Pip. Mình còn năm ngày nữa.'),
      l('me', 'Wir machen den Hafen fertig.', 'Mình làm xong bến cảng đã.'),
    ], post: { de: 'Auf der Liste stehen: Laternen, Glocke, Leuchtboje, Fahnen, Steg. Fünf Dinge, fünf Tage.', vi: 'Trong danh sách có: đèn, chuông, phao đèn, cờ, cầu tàu. Năm việc, năm ngày.' } },
    { pre: [
      l('v', 'Heute die Laternen. Alle zwölf entlang der Mole.', 'Hôm nay là đèn. Cả mười hai chiếc dọc đê chắn sóng.'),
    ], post: { de: 'Laterne um Laterne geht an. Die Mole sieht aus wie eine Perlenkette.', vi: 'Từng chiếc đèn bật sáng. Đê chắn sóng trông như một chuỗi ngọc.' } },
    { pre: [
      l('v', 'Die letzte Laterne steht ganz vorn an der Spitze, wo der Wind am stärksten ist.', 'Chiếc đèn cuối ở tít đầu đê, nơi gió mạnh nhất.'),
      l('me', 'Wusel, hilfst du?', 'Xoáy Nhỏ, giúp nhé?'),
    ], post: { de: 'Wusel hält den Wind zurück, die letzte Laterne leuchtet. In ihrem Glas: das fünfundzwanzigste Stück.', vi: 'Xoáy Nhỏ giữ gió lại, chiếc đèn cuối bừng sáng. Trong lồng kính là mảnh thứ hai mươi lăm.' } },
  ],
  26: [
    { pre: [
      l('v', 'Heute die Hafenglocke. Sie hängt seit dem Sturm stumm.', 'Hôm nay là chuông bến cảng. Từ sau bão nó im lặng.'),
      l('me', 'Läuten wir sie!', 'Mình rung chuông thôi!'),
    ], post: { de: 'Das Seil ist gerissen. Die Glocke hängt hoch im Turm.', vi: 'Dây kéo đã đứt. Chiếc chuông treo cao trên tháp.' } },
    { pre: [
      l('v', 'Die Treppe zum Glockenturm ist steil. Eine Stufe, kurz stehen, nächste Stufe.', 'Cầu thang lên tháp chuông dốc lắm. Một bậc, đứng chút, bậc tiếp.'),
      l('p', 'Ich warte oben. Mit Aussicht.', 'Tớ chờ trên đó. Ngắm cảnh.'),
      l('me', 'Stufe für Stufe.', 'Từng bậc một.'),
    ], post: { de: 'Oben angekommen knotet Vestibu ein neues Seil fest.', vi: 'Lên tới nơi, Vestibu buộc một sợi dây mới thật chắc.' } },
    { pre: [
      l('v', 'Jetzt ziehen. Die Glocke ist schwer – ich stehe breit und fest.', 'Giờ kéo thôi. Chuông nặng lắm – mình đứng rộng chân và vững.'),
      l('me', 'Ziehen!', 'Kéo!'),
    ], post: { de: 'DONG! Über die ganze Insel hallt die Glocke. Aus ihrem Inneren fällt das sechsundzwanzigste Stück.', vi: 'BOONG! Tiếng chuông vang khắp hòn đảo. Từ trong lòng chuông rơi ra mảnh thứ hai mươi sáu.' } },
  ],
  27: [
    { pre: [
      l('v', 'Die Leuchtboje draußen im Wasser ist umgekippt. Schiffe brauchen sie.', 'Phao đèn ngoài khơi bị lật rồi. Tàu thuyền cần nó.'),
      l('p', 'Draußen im Wasser. Mit Wellen. Ich bleibe hier.', 'Ngoài khơi. Có sóng. Tớ ở lại đây.'),
      l('me', 'Wir nehmen das Boot.', 'Mình đi thuyền.'),
    ], post: { de: 'Das Boot schaukelt. Vestibu steht in der Mitte und hält das Gleichgewicht.', vi: 'Thuyền tròng trành. Vestibu đứng giữa và giữ thăng bằng.' } },
    { pre: [
      l('v', 'Auf einem Boot gleicht man jede Welle mit den Knien aus. Weich bleiben.', 'Trên thuyền, đầu gối phải đỡ từng con sóng. Cứ mềm mại.'),
      l('p', '(vom Ufer) Ihr macht das toll! Glaube ich! Ich sehe es nicht genau!', '(từ trên bờ) Các cậu làm hay lắm! Chắc vậy! Tớ không thấy rõ!'),
      l('me', 'Wir sind fast da.', 'Sắp tới rồi.'),
    ], post: { de: 'Mit einem Seil zieht Vestibu die Boje wieder aufrecht.', vi: 'Bằng một sợi dây, Vestibu kéo phao dựng đứng trở lại.' } },
    { pre: [
      l('v', 'Jetzt noch das Licht der Boje anzünden. Ganz ruhige Hände im schaukelnden Boot.', 'Giờ thắp đèn phao. Tay thật vững trên con thuyền tròng trành.'),
      l('me', 'Ruhig. Ruhig.', 'Bình tĩnh. Bình tĩnh.'),
    ], post: { de: 'Die Boje blinkt grün. In ihrem Fuß steckt das siebenundzwanzigste Stück.', vi: 'Phao nháy đèn xanh. Dưới chân phao là mảnh thứ hai mươi bảy.' } },
  ],
  28: [
    { pre: [
      l('p', 'Heute bin ich dran! Die Fahnen. Fahnen sind Möwensache.', 'Hôm nay tới lượt tớ! Các lá cờ. Cờ là chuyện của hải âu.'),
      l('v', 'Dann führe uns, Pip.', 'Vậy dẫn đường đi, Pip.'),
      l('me', 'Pip, der Fahnenkapitän!', 'Pip, thuyền trưởng cờ!'),
    ], post: { de: 'Pip ist so stolz, dass er die erste Fahne verkehrt herum aufhängt.', vi: 'Pip tự hào tới mức treo ngược lá cờ đầu tiên.' } },
    { pre: [
      l('v', 'Jeder Mast hat eine Fahne in einer Farbe. Zusammen ergeben sie ein Wort.', 'Mỗi cột có một lá cờ một màu. Gộp lại sẽ thành một chữ.'),
      l('me', 'Wir finden es heraus.', 'Mình sẽ biết thôi.'),
    ], post: { de: 'Die Fahnen buchstabieren in alter Seemannssprache: „DANKE“.', vi: 'Các lá cờ ghép thành chữ bằng tín hiệu thủy thủ xưa: “CẢM ƠN”.' } },
    { pre: [
      l('v', 'Der Hafen sagt Danke. An dich.', 'Bến cảng nói cảm ơn. Với bạn.'),
      l('me', 'Danke zurück!', 'Cảm ơn lại nhé!'),
    ], post: { de: 'Die Kinder des Hafens schenken dir das achtundzwanzigste Stück, in Papier gewickelt wie ein Bonbon.', vi: 'Lũ trẻ bến cảng tặng bạn mảnh thứ hai mươi tám, gói giấy như một viên kẹo.' } },
  ],
  29: [
    { pre: [
      l('v', 'Der letzte Punkt auf der Liste: der alte Steg vom ersten Tag.', 'Việc cuối trong danh sách: cầu tàu cũ từ ngày đầu tiên.'),
      l('p', 'Da, wo ich das erste Stück … gefunden habe.', 'Chỗ tớ … tìm thấy mảnh đầu tiên.'),
      l('me', '„Gefunden“, Pip?', '“Tìm thấy” hả Pip?'),
    ], post: { de: 'Pip versteckt den Kopf unter dem Flügel. Alle lachen.', vi: 'Pip giấu đầu dưới cánh. Mọi người phá lên cười.' } },
    { pre: [
      l('v', 'Weißt du noch, wie wackelig du am ersten Tag warst? Und jetzt?', 'Bạn còn nhớ ngày đầu bạn run thế nào không? Còn giờ thì sao?'),
      l('me', 'Jetzt stehe ich sicher.', 'Giờ mình đứng vững rồi.'),
      l('p', 'Fast so gut wie eine Möwe.', 'Gần bằng hải âu rồi đấy.'),
    ], post: { de: 'Vestibu legt das letzte Brett auf den Steg. Er ist schöner als je zuvor.', vi: 'Vestibu đặt tấm ván cuối cùng lên cầu tàu. Nó đẹp hơn bao giờ hết.' } },
    { pre: [
      l('v', 'Morgen ist der letzte Tag im Hafen. Lass uns heute noch einmal ganz bewusst üben.', 'Mai là ngày cuối ở bến cảng. Hôm nay mình tập thật chú tâm thêm lần nữa nhé.'),
      l('me', 'Für den Hafen.', 'Vì bến cảng.'),
    ], post: { de: 'Unter dem neuen Steg glitzert das neunundzwanzigste Stück im klaren Wasser. Die Insel schwankt kaum noch.', vi: 'Dưới cầu tàu mới, mảnh thứ hai mươi chín lấp lánh trong làn nước trong. Hòn đảo gần như không còn chao.' } },
  ],
  30: [
    { pre: [
      l('v', 'Dreißig Tage. Der Hafen leuchtet. Heute brechen wir auf.', 'Ba mươi ngày. Bến cảng rực sáng. Hôm nay mình lên đường.'),
      l('p', 'Ein Schwarm bleibt zusammen.', 'Đã là một đàn thì phải ở bên nhau.'),
    ], post: { de: 'Die Fischer packen Proviant. Pip packt heimlich drei Fische dazu.', vi: 'Ngư dân chuẩn bị lương thực. Pip lén nhét thêm ba con cá.' } },
    { pre: [
      l('v', 'Der ganze Hafen steht am Weg und winkt.', 'Cả bến cảng đứng dọc đường vẫy tay.'),
      l('me', 'Wir kommen wieder!', 'Bọn mình sẽ quay lại!'),
    ], post: { de: 'Die Glocke läutet zum Abschied. Wusel weht als warme Brise voraus.', vi: 'Chuông ngân tiễn biệt. Xoáy Nhỏ thổi thành làn gió ấm dẫn đường.' } },
    { pre: [
      l('v', 'Da ist es: das Tor aus Wurzeln. Genau wie auf deiner Karte.', 'Kia rồi: cánh cổng bằng rễ cây. Y như trên tấm thiệp của bạn.'),
      l('me', 'Bereit für den Wald.', 'Sẵn sàng vào rừng.'),
    ], post: { de: 'Das Tor öffnet sich knarrend. Im Moos liegt das dreißigste Stück – und eine Stimme flüstert zwischen den Bäumen: „Hört zu …“', vi: 'Cánh cổng kẽo kẹt mở ra. Trên lớp rêu là mảnh thứ ba mươi – và một giọng nói thì thầm giữa những tán cây: “Hãy lắng nghe …”' } },
  ],
}
