import type { SessionScene, Who, Line } from './storyDialog'

const l = (who: Who, de: string, vi: string): Line => ({ who, de, vi })

// Days 61–90: the lighthouse. Ilse, the climb, the lamp, Pip's confession, one last storm –
// and on day 90 the Balance Stone is whole and the light returns.
export const lighthouseDialog: Record<number, SessionScene[]> = {
  61: [
    { pre: [
      l('v', 'Sie sind Ilse. Vom Foto.', 'Bà là Ilse. Trong tấm ảnh.'),
      l('me', 'Wir bringen den Stein.', 'Bọn cháu mang hòn đá tới.'),
    ], post: { de: 'Ilse umarmt Vestibu lange. „Du bist so groß geworden. Und du“ – sie schaut dich an – „du hast meine Karte bekommen.“', vi: 'Ilse ôm Vestibu thật lâu. “Con lớn quá rồi. Còn con” – bà nhìn bạn – “con đã nhận được tấm thiệp của ta.”' } },
    { pre: [
      l('v', 'Ilse, warum haben Sie die Karte leer geschickt?', 'Bà Ilse, sao bà gửi tấm thiệp trắng?'),
      l('me', 'Was sollte darauf stehen?', 'Đáng lẽ phải viết gì trên đó?'),
    ], post: { de: 'Ilse lacht: „Eine leere Karte fragt: Wer kommt? Nur wer sich traut, schreibt seinen Namen darauf.“', vi: 'Ilse cười: “Tấm thiệp trắng là câu hỏi: Ai sẽ tới? Chỉ người dám bước đi mới viết tên mình lên đó.”' } },
    { pre: [
      l('v', 'Ilse zeigt uns den Turm. Ganz oben ist die Lampe. Und der leere Sockel für den Stein.', 'Ilse dẫn bọn mình xem tháp. Trên đỉnh là ngọn đèn. Và cái bệ trống chờ hòn đá.'),
      l('me', 'Wie viele Stufen?', 'Bao nhiêu bậc?'),
    ], post: { de: '„Dreihundertdreiunddreißig“, sagt Ilse. „Aber die Treppe ist im Sturm beschädigt worden.“ Sie gibt dir das einundsechzigste Stück.', vi: '“Ba trăm ba mươi ba”, Ilse nói. “Nhưng cầu thang đã hư trong bão.” Bà trao bạn mảnh thứ sáu mươi mốt.' } },
  ],
  62: [
    { pre: [
      l('v', 'Bevor wir hochsteigen, will Ilse uns etwas beibringen.', 'Trước khi leo lên, Ilse muốn dạy bọn mình một điều.'),
      l('me', 'Was denn, Ilse?', 'Là gì vậy bà?'),
    ], post: { de: 'Ilse zeigt eine alte Übung: auf einem Bein stehen und dabei das Meer anschauen. „So habe ich es vierzig Jahre gemacht.“', vi: 'Ilse chỉ một bài tập xưa: đứng một chân và nhìn ra biển. “Ta đã làm thế suốt bốn mươi năm.”' } },
    { pre: [
      l('v', 'Ilse ist so ruhig. Wie der Fels unter dem Turm.', 'Ilse bình thản quá. Như tảng đá dưới chân tháp.'),
      l('p', 'Ich will auch so alt und ruhig werden.', 'Tớ cũng muốn già và bình thản như vậy.'),
      l('me', 'Wir üben mit ihr.', 'Mình tập cùng bà.'),
    ], post: { de: 'Drei auf einem Bein, eine Möwe auf einem Bein. Die Sonne geht unter.', vi: 'Ba người đứng một chân, một chú hải âu đứng một chân. Mặt trời lặn.' } },
    { pre: [
      l('v', 'Ilse erzählt vom Stein: Er hält die Insel im Gleichgewicht – aber nur, wenn jemand ihn pflegt.', 'Ilse kể về hòn đá: Nó giữ hòn đảo thăng bằng – nhưng chỉ khi có người chăm sóc.'),
      l('me', 'Wie pflegt man einen Stein?', 'Chăm sóc hòn đá thế nào?'),
    ], post: { de: '„Indem man jeden Tag ein wenig übt“, sagt Ilse und zwinkert. Das zweiundsechzigste Stück liegt auf ihrem Fensterbrett.', vi: '“Bằng cách mỗi ngày tập một chút”, Ilse nói rồi nháy mắt. Mảnh thứ sáu mươi hai nằm trên bậu cửa sổ.' } },
  ],
  63: [
    { pre: [
      l('p', 'Ilse … ich muss dir was sagen.', 'Bà Ilse … cháu phải nói với bà một chuyện.'),
      l('v', 'Du schaffst das, Pip.', 'Cậu làm được mà, Pip.'),
      l('p', 'Das erste Stück. Ich hab es aus deinem Garten genommen. Vor dem Sturm. Es tut mir leid.', 'Mảnh đầu tiên. Cháu lấy nó từ vườn của bà. Trước cơn bão. Cháu xin lỗi.'),
      l('me', 'Er hat es zurückgebracht.', 'Cậu ấy đã mang nó về.'),
    ], post: { de: 'Ilse streichelt Pips Kopf. „Und du hast es den ganzen Weg zurück begleitet. Das zählt mehr.“', vi: 'Ilse xoa đầu Pip. “Và cháu đã cùng nó đi suốt chặng đường về. Điều đó quý hơn.”' } },
    { pre: [
      l('v', 'Pip ist so erleichtert, dass er einen Freudentanz macht.', 'Pip nhẹ nhõm tới mức nhảy điệu mừng vui.'),
      l('me', 'Wir tanzen mit!', 'Mình nhảy cùng!'),
    ], post: { de: 'Sogar Ilse macht mit. Sie wackelt kein bisschen.', vi: 'Cả Ilse cũng nhảy theo. Bà không chao chút nào.' } },
    { pre: [
      l('v', 'Morgen beginnen wir mit dem Aufstieg.', 'Mai bọn mình bắt đầu leo tháp.'),
      l('me', 'Wir sind bereit.', 'Bọn mình sẵn sàng.'),
    ], post: { de: 'Ilse schenkt Pip einen Keks – den ersten seit drei Jahren. Darunter auf dem Teller: das dreiundsechzigste Stück.', vi: 'Ilse tặng Pip một cái bánh quy – cái đầu tiên sau ba năm. Dưới đĩa là mảnh thứ sáu mươi ba.' } },
  ],
  64: [
    { pre: [
      l('v', 'Die ersten Stufen sind fest. Aber eng und gewunden.', 'Những bậc đầu chắc chắn. Nhưng hẹp và xoắn ốc.'),
      l('p', 'Wendeltreppe. Mir wird schwindlig.', 'Cầu thang xoắn. Tớ chóng mặt rồi.'),
      l('me', 'Blick auf die nächste Stufe.', 'Nhìn vào bậc tiếp theo.'),
    ], post: { de: 'Fünfzig Stufen geschafft. Durch ein kleines Fenster sieht man den Hafen – winzig klein.', vi: 'Đã leo năm mươi bậc. Qua ô cửa nhỏ thấy bến cảng – bé tí xíu.' } },
    { pre: [
      l('v', 'Bei Schwindel hilft: kurz stehen bleiben, einen Punkt fixieren, atmen.', 'Khi chóng mặt: dừng lại một chút, nhìn chắc một điểm, thở đều.'),
      l('p', 'Ich fixiere … den Hafen. Mein Hafen. Okay. Besser.', 'Tớ nhìn … bến cảng. Bến cảng của tớ. Được rồi. Đỡ hơn.'),
      l('me', 'Weiter geht’s.', 'Đi tiếp thôi.'),
    ], post: { de: 'Hundert Stufen. An der Wand hängen alte Fotos von Ilse und dem leuchtenden Turm.', vi: 'Một trăm bậc. Trên tường treo những tấm ảnh cũ của Ilse và ngọn tháp rực sáng.' } },
    { pre: [
      l('v', 'Hier ist ein Absatz zum Ausruhen. Ich dehne meine Waden.', 'Ở đây có chiếu nghỉ. Mình giãn bắp chân.'),
      l('me', 'Gute Idee.', 'Ý hay đấy.'),
    ], post: { de: 'Hinter einem Foto klemmt das vierundsechzigste Stück.', vi: 'Sau một tấm ảnh kẹt mảnh thứ sáu mươi tư.' } },
  ],
  65: [
    { pre: [
      l('v', 'Hier fehlen Stufen. Der Sturm hat sie herausgerissen.', 'Ở đây mất mấy bậc. Cơn bão đã giật chúng ra.'),
      l('p', 'Und jetzt? Zurück?', 'Giờ sao? Quay lại à?'),
      l('me', 'Wir reparieren sie.', 'Mình sửa chúng.'),
    ], post: { de: 'Ilse schickt Bretter mit einem Seilzug nach oben.', vi: 'Ilse dùng ròng rọc gửi ván lên.' } },
    { pre: [
      l('v', 'Jedes Brett muss ich auf einer Stufe stehend einsetzen. Ganz ruhig.', 'Mỗi tấm ván mình phải lắp khi đứng trên một bậc. Thật bình tĩnh.'),
      l('me', 'Gutes Team.', 'Đội hay đấy.'),
    ], post: { de: 'Drei neue Stufen. Sie halten.', vi: 'Ba bậc mới. Chúng chắc chắn.' } },
    { pre: [
      l('v', 'Ich teste die neuen Stufen. Erst vorsichtig, dann mit vollem Gewicht.', 'Mình thử các bậc mới. Ban đầu nhẹ nhàng, rồi dồn hết sức nặng.'),
      l('me', 'Sie halten!', 'Chúng chắc lắm!'),
    ], post: { de: 'Unter einer alten Stufe lag das fünfundsechzigste Stück. Der Sturm hat es dort versteckt.', vi: 'Dưới một bậc cũ là mảnh thứ sáu mươi lăm. Cơn bão đã giấu nó ở đó.' } },
  ],
  66: [
    { pre: [
      l('v', 'Zweihundert Stufen. Hier ist Ilses altes Arbeitszimmer.', 'Hai trăm bậc. Đây là phòng làm việc cũ của Ilse.'),
      l('p', 'Bücher! Karten! Und ein Fernrohr!', 'Sách! Bản đồ! Và ống nhòm!'),
      l('me', 'Das Fernrohr, mit dem sie uns gesehen hat.', 'Cái ống nhòm bà dùng để thấy bọn mình.'),
    ], post: { de: 'Durch das Fernrohr sieht man den Hafen, den Wald – und Fenna, die zurückwinkt.', vi: 'Qua ống nhòm thấy bến cảng, khu rừng – và Fenna đang vẫy tay.' } },
    { pre: [
      l('v', 'Auf dem Tisch liegt ein Tagebuch. Ilse hat jeden Tag etwas aufgeschrieben.', 'Trên bàn có cuốn nhật ký. Ngày nào Ilse cũng viết gì đó.'),
      l('p', 'Was steht da? Lies vor!', 'Viết gì vậy? Đọc to lên!'),
      l('me', 'Darf man das lesen?', 'Có được đọc không?'),
    ], post: { de: 'Auf der aufgeschlagenen Seite steht nur: „Tag 66. Sie kommen. Ich übe weiter.“', vi: 'Trang đang mở chỉ ghi: “Ngày 66. Họ đang tới. Ta tiếp tục tập.”' } },
    { pre: [
      l('v', 'Ilse hat jeden Tag auf uns gewartet. Und dabei geübt.', 'Ngày nào Ilse cũng chờ bọn mình. Và vẫn luyện tập.'),
      l('me', 'Wir üben mit ihr.', 'Mình tập cùng bà.'),
    ], post: { de: 'Zwischen den Seiten liegt eine gepresste Blume – und das sechsundsechzigste Stück.', vi: 'Kẹp giữa các trang là một bông hoa ép – và mảnh thứ sáu mươi sáu.' } },
  ],
  67: [
    { pre: [
      l('v', 'Die letzten Stufen sind die steilsten. Fast wie eine Leiter.', 'Những bậc cuối dốc nhất. Gần như cái thang.'),
      l('me', 'Hand, Fuß, ganz ruhig.', 'Tay, chân, thật bình tĩnh.'),
    ], post: { de: 'Hand, Fuß, Hand, Fuß. Vestibu klettert ruhig und gleichmäßig.', vi: 'Tay, chân, tay, chân. Vestibu leo đều đặn và bình tĩnh.' } },
    { pre: [
      l('v', 'Dreihundertdreiunddreißig! Wir sind oben!', 'Ba trăm ba mươi ba! Bọn mình lên tới đỉnh rồi!'),
      l('me', 'Was für eine Aussicht!', 'Cảnh đẹp quá!'),
    ], post: { de: 'Die ganze Insel liegt unter euch. Und mitten im Raum: die große, dunkle Lampe.', vi: 'Cả hòn đảo nằm dưới chân. Và giữa phòng: ngọn đèn lớn, tối om.' } },
    { pre: [
      l('v', 'Die Lampe ist voller Staub. Und die Linse hat einen Sprung.', 'Ngọn đèn phủ đầy bụi. Và thấu kính bị nứt.'),
      l('me', 'Viel Arbeit.', 'Nhiều việc đây.'),
    ], post: { de: 'Noch dreiundzwanzig Tage bis zum Licht. Auf dem Sockel liegt schon das siebenundsechzigste Stück.', vi: 'Còn hai mươi ba ngày nữa tới lúc đèn sáng. Trên bệ đã có sẵn mảnh thứ sáu mươi bảy.' } },
  ],
  68: [
    { pre: [
      l('v', 'Heute putzen wir die Lampe. Mit Fennas Pinsel.', 'Hôm nay mình lau đèn. Bằng chổi của Fenna.'),
      l('p', 'Ich puste den Staub weg. Wusel auch.', 'Tớ thổi bụi đi. Xoáy Nhỏ cũng vậy.'),
      l('me', 'Nicht zu stark!', 'Đừng mạnh quá!'),
    ], post: { de: 'Wusel pustet einmal zu kräftig. Eine Staubwolke. Alle husten und lachen.', vi: 'Xoáy Nhỏ thổi mạnh quá một lần. Một đám bụi bay mù. Ai cũng ho rồi phá lên cười.' } },
    { pre: [
      l('v', 'Die oberen Spiegel putze ich mit Fennas langem Pinsel – eine Hand am Geländer.', 'Những tấm gương trên cao mình lau bằng chổi dài của Fenna – một tay vịn lan can.'),
      l('me', 'Festhalten, dann putzen.', 'Vịn chắc rồi mới lau.'),
    ], post: { de: 'Spiegel für Spiegel glänzt wieder. Die Abendsonne bricht sich in tausend Farben.', vi: 'Từng tấm gương sáng bóng trở lại. Nắng chiều vỡ thành ngàn sắc màu.' } },
    { pre: [
      l('v', 'Der letzte Spiegel ist ganz unten. Ich gehe tief in die Knie.', 'Tấm gương cuối ở tít dưới thấp. Mình khuỵu gối thật sâu.'),
      l('me', 'Stark!', 'Giỏi lắm!'),
    ], post: { de: 'Hinter dem letzten Spiegel: das achtundsechzigste Stück.', vi: 'Sau tấm gương cuối: mảnh thứ sáu mươi tám.' } },
  ],
  69: [
    { pre: [
      l('v', 'Die gesprungene Linse. Ilse sagt, nur einer kann sie reparieren: der Glasbläser im Hafen.', 'Thấu kính bị nứt. Ilse bảo chỉ có một người sửa được: ông thợ thổi thủy tinh ở bến cảng.'),
      l('p', 'Der Hafen! Ich fliege! Ich bin die schnellste Post der Insel.', 'Bến cảng! Tớ bay! Tớ là bưu tá nhanh nhất đảo.'),
      l('me', 'Die Linse ist zu schwer für dich.', 'Thấu kính quá nặng với cậu.'),
    ], post: { de: 'Pip fliegt mit einer Nachricht los. Die Linse bleibt hier.', vi: 'Pip bay đi mang một lời nhắn. Thấu kính ở lại.' } },
    { pre: [
      l('v', 'Während wir warten, üben wir oben auf dem Rundgang. Im Wind.', 'Trong lúc chờ, mình tập trên ban công vòng quanh tháp. Trong gió.'),
      l('me', 'Mit Geländer.', 'Có lan can mà.'),
    ], post: { de: 'Der Wind hier oben ist stark. Aber nach neunundsechzig Tagen steht Vestibu darin wie ein Fels.', vi: 'Gió trên này mạnh lắm. Nhưng sau sáu mươi chín ngày, Vestibu đứng trong gió vững như đá.' } },
    { pre: [
      l('v', 'Da kommt Pip zurück! Und hinter ihm … ein Boot.', 'Pip quay lại kìa! Và phía sau … một chiếc thuyền.'),
      l('me', 'Der Glasbläser kommt selbst!', 'Ông thợ thủy tinh tự tới!'),
    ], post: { de: 'Der Glasbläser bringt Werkzeug – und einen Gruß vom Hafen: das neunundsechzigste Stück.', vi: 'Ông thợ thủy tinh mang theo đồ nghề – và lời chào từ bến cảng: mảnh thứ sáu mươi chín.' } },
  ],
  70: [
    { pre: [
      l('v', 'Siebzig Tage! Der Glasbläser braucht unsere Hilfe.', 'Bảy mươi ngày! Ông thợ thủy tinh cần bọn mình giúp.'),
      l('p', 'Ich halte nichts aus Glas. Ich habe Erfahrung. Schlechte.', 'Tớ không cầm đồ thủy tinh đâu. Tớ có kinh nghiệm rồi. Không hay ho gì.'),
      l('me', 'Ich halte die Linse.', 'Mình giữ thấu kính.'),
    ], post: { de: 'Die Linse ist schwer und rund. Wer sie hält, muss absolut ruhig stehen.', vi: 'Thấu kính nặng và tròn. Ai giữ nó phải đứng tuyệt đối yên.' } },
    { pre: [
      l('v', 'Jetzt kommt das heiße Glas in den Sprung. Nicht bewegen!', 'Giờ đổ thủy tinh nóng vào vết nứt. Đừng cử động!'),
      l('me', 'Ganz still.', 'Thật yên.'),
    ], post: { de: 'Das Glas füllt den Sprung. Es zischt und glüht.', vi: 'Thủy tinh lấp đầy vết nứt. Nó xèo xèo và đỏ rực.' } },
    { pre: [
      l('v', 'Jetzt muss es abkühlen. Noch einmal ganz still halten.', 'Giờ chờ nó nguội. Thêm một lần giữ thật yên.'),
      l('me', 'Ich halte durch.', 'Mình trụ được.'),
    ], post: { de: 'Die Linse ist heil. Der Glasbläser nickt beeindruckt. Im Werkzeugkasten: das siebzigste Stück.', vi: 'Thấu kính đã lành. Ông thợ gật gù thán phục. Trong hộp đồ nghề: mảnh thứ bảy mươi.' } },
  ],
  71: [
    { pre: [
      l('v', 'Die Linse muss zurück in die Lampe. Sie ist sehr schwer.', 'Thấu kính phải lắp lại vào đèn. Nó nặng lắm.'),
    ], post: { de: 'Mit Ilse zusammen heben alle die Linse an. Breitbeinig, gerader Rücken.', vi: 'Cùng với Ilse, cả nhóm nhấc thấu kính lên. Chân rộng, lưng thẳng.' } },
    { pre: [
      l('v', 'Ein kleines Stück höher. Alle heben zusammen, niemand steht allein.', 'Cao thêm chút nữa. Mọi người cùng nâng, không ai làm một mình.'),
      l('me', 'Fast!', 'Sắp được rồi!'),
    ], post: { de: 'Klick. Die Linse sitzt.', vi: 'Tách. Thấu kính đã vào chỗ.' } },
    { pre: [
      l('v', 'Jetzt fehlt nur noch der Stein im Sockel. Und ein paar Stücke fehlen auch noch.', 'Giờ chỉ còn thiếu hòn đá trên bệ. Và vẫn còn thiếu vài mảnh.'),
      l('me', 'Wie viele?', 'Bao nhiêu?'),
    ], post: { de: 'Ilse zählt: neunzehn. Eines davon findet sie gleich in ihrer Schürzentasche. Einundsiebzig.', vi: 'Ilse đếm: mười chín. Bà tìm ngay được một mảnh trong túi tạp dề. Bảy mươi mốt.' } },
  ],
  72: [
    { pre: [
      l('v', 'Wo sind die letzten Stücke? Der Stein summt – aber leise, von überall her.', 'Những mảnh cuối ở đâu? Hòn đá ngân – nhưng khe khẽ, từ khắp nơi.'),
      l('p', 'Überall ist kein Ort.', 'Khắp nơi đâu phải là một chỗ.'),
      l('me', 'Wir fragen die Freunde.', 'Mình hỏi bạn bè.'),
    ], post: { de: 'Ilse schickt Lichtsignale über die ganze Insel. Die Antworten kommen von überall.', vi: 'Ilse gửi tín hiệu đèn khắp hòn đảo. Lời đáp tới từ mọi nơi.' } },
    { pre: [
      l('v', 'Fenna antwortet aus dem Wald. Die Fischer aus dem Hafen. Bruno aus seiner Höhle.', 'Fenna đáp từ khu rừng. Ngư dân từ bến cảng. Bruno từ hang của chú.'),
      l('p', 'Sie haben alle Stücke gefunden!', 'Họ đều tìm thấy các mảnh đá!'),
      l('me', 'Sie bringen sie her!', 'Họ đang mang tới đây!'),
    ], post: { de: 'Die ganze Insel macht sich auf den Weg zum Leuchtturm.', vi: 'Cả hòn đảo lên đường tới hải đăng.' } },
    { pre: [
      l('v', 'Bis sie da sind, üben wir weiter. Der Stein braucht ruhige Hände.', 'Trong lúc chờ họ, mình tập tiếp. Hòn đá cần đôi tay vững.'),
      l('me', 'Ruhige Hände.', 'Đôi tay vững.'),
    ], post: { de: 'Als erste kommt eine Brieftaube. Sie trägt das zweiundsiebzigste Stück.', vi: 'Tới đầu tiên là một chú bồ câu đưa thư. Nó mang mảnh thứ bảy mươi hai.' } },
  ],
  73: [
    { pre: [
      l('p', 'Boote! Viele! Der ganze Hafen kommt!', 'Thuyền! Nhiều lắm! Cả bến cảng tới!'),
      l('v', 'Die Flut ist hoch. Sie können nicht anlegen.', 'Thủy triều đang lên cao. Họ không cập bến được.'),
      l('me', 'Wir helfen beim Anlegen.', 'Mình giúp họ cập bến.'),
    ], post: { de: 'Am Fuß des Turms wirft Vestibu Seile zu den Booten.', vi: 'Dưới chân tháp, Vestibu ném dây cho các thuyền.' } },
    { pre: [
      l('v', 'Die Felsen sind nass. Ich stehe breit und ziehe.', 'Đá ướt hết. Mình đứng rộng chân và kéo.'),
      l('me', 'Zieh, Vestibu!', 'Kéo đi, Vestibu!'),
    ], post: { de: 'Ein Boot nach dem anderen liegt sicher am Felsen.', vi: 'Từng chiếc thuyền cập vào đá an toàn.' } },
    { pre: [
      l('v', 'Der Bootsbauer gibt mir etwas. „Für den Stein“, sagt er.', 'Ông thợ thuyền đưa mình một thứ. “Cho hòn đá”, ông nói.'),
      l('me', 'Danke!', 'Cảm ơn ông!'),
    ], post: { de: 'Das dreiundsiebzigste Stück. Und die Kinder bringen noch zwei – morgen, versprechen sie.', vi: 'Mảnh thứ bảy mươi ba. Lũ trẻ hứa mai sẽ mang thêm hai mảnh nữa.' } },
  ],
  74: [
    { pre: [
      l('v', 'Die Kinder vom Hafen wollen den Leuchtturm sehen.', 'Lũ trẻ bến cảng muốn xem hải đăng.'),
      l('p', 'Dreihundertdreiunddreißig Stufen! Mit Kindern!', 'Ba trăm ba mươi ba bậc! Với lũ trẻ!'),
      l('me', 'Wir zeigen ihnen, wie man sicher steigt.', 'Mình chỉ chúng cách leo cho an toàn.'),
    ], post: { de: 'Vestibu geht voran. Langsam, Stufe für Stufe. Die Kinder machen es nach.', vi: 'Vestibu đi đầu. Chậm rãi, từng bậc một. Lũ trẻ bắt chước theo.' } },
    { pre: [
      l('v', 'Jetzt bin ich der Lehrer. Wie Pip im Hafen.', 'Giờ mình làm thầy. Như Pip ở bến cảng.'),
    ], post: { de: 'Oben angekommen stehen alle Kinder auf einem Bein und schauen aufs Meer – wie Ilse.', vi: 'Lên tới đỉnh, lũ trẻ đều đứng một chân nhìn ra biển – như Ilse.' } },
    { pre: [
      l('v', 'Die Kinder haben ein Geschenk.', 'Lũ trẻ có quà.'),
      l('me', 'Zeigt her!', 'Cho xem nào!'),
    ], post: { de: 'Zwei Stücke, in Bonbonpapier gewickelt. Vierundsiebzig – und das nächste für morgen.', vi: 'Hai mảnh đá gói giấy kẹo. Bảy mươi tư – và mảnh tiếp theo để dành cho mai.' } },
  ],
  75: [
    { pre: [
      l('v', 'Heute kommen die Waldbewohner. Fenna, Bruno, der Reiher.', 'Hôm nay cư dân rừng tới. Fenna, Bruno, chú diệc.'),
      l('p', 'Über den Damm? Bei Ebbe? Füchse können das?', 'Qua con đê? Khi triều rút? Cáo làm được à?'),
      l('me', 'Wir holen sie ab.', 'Mình ra đón họ.'),
    ], post: { de: 'Vestibu geht über den glitschigen Damm. Diesmal ganz ohne Angst.', vi: 'Vestibu đi qua con đê trơn. Lần này chẳng chút sợ hãi.' } },
    { pre: [
      l('v', 'Bruno trägt einen riesigen Korb. Er wackelt.', 'Bruno mang một cái giỏ khổng lồ. Chú chao đảo.'),
      l('me', 'Ich nehme den Korb.', 'Để mình mang giỏ.'),
    ], post: { de: 'Natürlich Kekse. Und Fennas Kinder hüpfen sicher über die Steine.', vi: 'Đương nhiên là bánh quy. Và lũ cáo con nhảy qua những hòn đá thật vững.' } },
    { pre: [
      l('v', 'Der Reiher landet auf der Turmspitze. Er hat etwas im Schnabel.', 'Chú diệc đáp xuống đỉnh tháp. Trong mỏ có gì đó.'),
      l('me', 'Das nächste Stück!', 'Mảnh tiếp theo!'),
    ], post: { de: 'Fünfundsiebzig. Ilse begrüßt den Reiher wie einen alten Freund. Er ist einer.', vi: 'Bảy mươi lăm. Ilse chào chú diệc như chào một người bạn cũ. Mà đúng là vậy.' } },
  ],
  76: [
    { pre: [
      l('v', 'Der Leuchtturm ist voller Gäste. Es ist laut und fröhlich.', 'Hải đăng chật kín khách. Ồn ào và vui vẻ.'),
      l('me', 'Wie ein Fest.', 'Như một bữa tiệc.'),
    ], post: { de: 'Doch am Abend wird Ilse still. Sie schaut lange aufs Meer.', vi: 'Nhưng tối đến, Ilse lặng đi. Bà nhìn ra biển rất lâu.' } },
    { pre: [
      l('v', 'Ilse, was ist los?', 'Bà Ilse, có chuyện gì vậy?'),
      l('p', 'Sie sieht etwas. Am Horizont. Dunkle Wolken.', 'Bà thấy gì đó. Ở chân trời. Mây đen.'),
      l('me', 'Noch ein Sturm?', 'Lại một cơn bão nữa?'),
    ], post: { de: 'Ilse nickt. „Ein großer. In zehn Tagen ist er hier. Bis dahin muss die Lampe leuchten.“', vi: 'Ilse gật đầu. “Một cơn lớn. Mười ngày nữa nó sẽ tới. Trước lúc đó đèn phải sáng.”' } },
    { pre: [
      l('v', 'Dann haben wir keine Zeit zu verlieren. Aber auch keinen Grund zur Eile.', 'Vậy mình không được phí thời gian. Nhưng cũng không cần vội vàng.'),
      l('me', 'Ruhig und jeden Tag.', 'Bình tĩnh và đều đặn mỗi ngày.'),
    ], post: { de: 'Wusel kommt zitternd zu dir. Er hat seine Mutter am Horizont gesehen. Er bringt das sechsundsiebzigste Stück.', vi: 'Xoáy Nhỏ run rẩy tới bên bạn. Nó đã thấy mẹ ở chân trời. Nó mang mảnh thứ bảy mươi sáu.' } },
  ],
  77: [
    { pre: [
      l('v', 'Ist das Wusels Mutter? Ist sie wieder durcheinander?', 'Đó là mẹ Xoáy Nhỏ à? Bà lại rối rồi sao?'),
      l('p', 'Wusel sagt nein. Es ist ein fremder Sturm. Einer, der nie gelernt hat, ruhig zu sein.', 'Xoáy Nhỏ bảo không. Là một cơn bão lạ. Một cơn chưa bao giờ học cách bình tĩnh.'),
      l('me', 'Dann zeigt ihm das Licht den Weg.', 'Vậy ánh đèn sẽ chỉ đường cho nó.'),
    ], post: { de: 'Ilse erklärt: Ein Leuchtturm hält Stürme nicht auf. Aber er zeigt allen, wo das Ufer ist.', vi: 'Ilse giải thích: Hải đăng không ngăn được bão. Nhưng nó cho mọi người biết bờ ở đâu.' } },
    { pre: [
      l('v', 'Die Boote im Hafen müssen das Licht sehen. Sonst finden sie nicht heim.', 'Thuyền ở bến phải thấy được đèn. Không thì không tìm được đường về.'),
      l('me', 'Wir schaffen das.', 'Mình làm được.'),
    ], post: { de: 'Die Gäste kehren auf ihre Boote zurück, um den Hafen zu sichern.', vi: 'Khách khứa quay về thuyền để giữ an toàn cho bến cảng.' } },
    { pre: [
      l('v', 'Jetzt sind wir wieder zu dritt. Mit Ilse zu viert.', 'Giờ lại còn bọn mình ba người. Với Ilse là bốn.'),
      l('me', 'Genug für ein Licht.', 'Đủ để thắp một ngọn đèn.'),
    ], post: { de: 'Beim Abschied steckt dir ein Fischer das siebenundsiebzigste Stück zu.', vi: 'Lúc chia tay, một ngư dân dúi vào tay bạn mảnh thứ bảy mươi bảy.' } },
  ],
  78: [
    { pre: [
      l('v', 'Ilse sagt: Der Stein muss in der richtigen Reihenfolge zusammengesetzt werden.', 'Ilse bảo: Hòn đá phải ghép đúng thứ tự.'),
      l('me', 'Wir fangen mit dem ersten an.', 'Bắt đầu từ mảnh đầu tiên.'),
    ], post: { de: 'Pip legt das erste Stück auf den Sockel. Das, das er einst genommen hatte. Es passt genau.', vi: 'Pip đặt mảnh đầu tiên lên bệ. Chính mảnh nó từng lấy. Vừa khít.' } },
    { pre: [
      l('v', 'Jedes Stück erinnert an einen Tag. Das hier – der Anker.', 'Mỗi mảnh gợi nhớ một ngày. Mảnh này – cái neo.'),
    ], post: { de: 'Der Stein wächst. Er summt lauter mit jedem Stück.', vi: 'Hòn đá lớn dần. Nó ngân to hơn theo từng mảnh.' } },
    { pre: [
      l('v', 'Bei jedem Stück muss ich ganz ruhig stehen, sonst rutscht es ab.', 'Mỗi mảnh mình phải đứng thật yên, không là trượt mất.'),
      l('me', 'Ruhig. Und weiter.', 'Bình tĩnh. Và tiếp tục.'),
    ], post: { de: 'Achtundsiebzig Stücke sitzen. Ein schwaches Leuchten geht vom Stein aus.', vi: 'Bảy mươi tám mảnh đã vào chỗ. Một ánh sáng mờ tỏa ra từ hòn đá.' } },
  ],
  79: [
    { pre: [
      l('v', 'Der Wind wird stärker. Der Sturm kommt näher.', 'Gió mạnh dần. Cơn bão đang tới gần.'),
      l('p', 'Meine Federn. Sie stehen wieder ab.', 'Lông tớ. Lại dựng đứng rồi.'),
      l('me', 'Wir bleiben ruhig.', 'Mình giữ bình tĩnh.'),
    ], post: { de: 'Die Fensterläden klappern. Ilse schließt sie einen nach dem anderen.', vi: 'Cửa chớp đập lạch cạch. Ilse đóng từng cánh một.' } },
    { pre: [
      l('v', 'Der Turm schwankt leicht. Aber wir wissen, wie man im Schwanken steht.', 'Tòa tháp hơi chao. Nhưng bọn mình biết cách đứng vững khi chao.'),
      l('p', 'Seit neunundsiebzig Tagen!', 'Từ bảy mươi chín ngày nay!'),
      l('me', 'Wir sind bereit.', 'Bọn mình sẵn sàng.'),
    ], post: { de: 'Vestibu steht ruhig im schwankenden Turm. Ilse lächelt stolz.', vi: 'Vestibu đứng vững trong tòa tháp chao nghiêng. Ilse mỉm cười tự hào.' } },
    { pre: [
      l('v', 'Wusel will helfen. Er will den fremden Sturm beruhigen.', 'Xoáy Nhỏ muốn giúp. Nó muốn làm dịu cơn bão lạ.'),
      l('me', 'Sei vorsichtig, Wusel.', 'Cẩn thận nhé, Xoáy Nhỏ.'),
    ], post: { de: 'Wusel fliegt hinaus und kommt mit dem neunundsiebzigsten Stück zurück. „Ich übe noch“, flüstert er.', vi: 'Xoáy Nhỏ bay ra ngoài rồi quay về cùng mảnh thứ bảy mươi chín. “Tớ vẫn đang tập”, nó thì thầm.' } },
  ],
  80: [
    { pre: [
      l('v', 'Achtzig Tage. Noch zehn bis zum Licht.', 'Tám mươi ngày. Còn mười ngày tới lúc đèn sáng.'),
      l('p', 'Und noch zehn Stücke.', 'Và còn mười mảnh nữa.'),
      l('me', 'Wo sind sie?', 'Chúng ở đâu?'),
    ], post: { de: 'Ilse holt eine alte Kiste vom Dachboden. „Die letzten zehn hat mir der Sturm gelassen. Ich wusste nur nicht, wofür.“', vi: 'Ilse lấy một chiếc hộp cũ trên gác. “Mười mảnh cuối, cơn bão đã để lại cho ta. Chỉ là ta không biết để làm gì.”' } },
    { pre: [
      l('v', 'Aber die Stücke in der Kiste sind dunkel. Sie leuchten nicht.', 'Nhưng các mảnh trong hộp tối om. Chúng không sáng.'),
      l('p', 'Kaputt?', 'Hỏng rồi à?'),
      l('me', 'Vielleicht müde.', 'Có lẽ chỉ mệt thôi.'),
    ], post: { de: 'Ilse erklärt: Die letzten Stücke leuchten erst, wenn jemand jeden Tag für sie übt.', vi: 'Ilse giải thích: Những mảnh cuối chỉ sáng khi có người tập luyện vì chúng mỗi ngày.' } },
    { pre: [
      l('v', 'Dann üben wir für jedes Stück einen Tag. Zehn Tage, zehn Stücke.', 'Vậy mỗi ngày mình tập cho một mảnh. Mười ngày, mười mảnh.'),
      l('me', 'Abgemacht.', 'Quyết vậy đi.'),
    ], post: { de: 'Das erste dunkle Stück glimmt auf. Achtzig. Es ist warm wie eine kleine Sonne.', vi: 'Mảnh tối đầu tiên le lói sáng. Tám mươi. Nó ấm như một mặt trời bé nhỏ.' } },
  ],
  81: [
    { pre: [
      l('v', 'Draußen tobt der Regen. Drinnen ist es warm.', 'Ngoài trời mưa xối xả. Trong này ấm áp.'),
      l('p', 'Ilse erzählt Geschichten. Von früher. Von Vestibu als Baby!', 'Ilse kể chuyện. Chuyện ngày xưa. Chuyện Vestibu hồi còn bé!'),
      l('me', 'Erzähl, Ilse!', 'Kể đi bà!'),
    ], post: { de: 'Klein-Vestibu ist früher jeden Tag umgefallen. Jeden Tag ist er wieder aufgestanden.', vi: 'Vestibu bé ngày nào cũng ngã. Ngày nào cũng lại đứng dậy.' } },
    { pre: [
      l('v', 'Das wusste ich nicht mehr. Dass ich auch mal wackelig war.', 'Mình quên mất. Rằng mình cũng từng run rẩy.'),
      l('p', 'Alle sind am Anfang wackelig. Sogar Möwen. Okay, nicht Möwen.', 'Ai lúc đầu cũng run. Kể cả hải âu. Thôi được, trừ hải âu.'),
      l('me', 'Und jetzt stehen wir.', 'Và giờ bọn mình đứng vững.'),
    ], post: { de: 'Ilse sagt: „Gleichgewicht ist kein Ziel. Es ist etwas, das man jeden Tag neu findet.“', vi: 'Ilse nói: “Thăng bằng không phải đích đến. Đó là thứ ta tìm lại mỗi ngày.”' } },
    { pre: [
      l('v', 'Für das zweite dunkle Stück. Ganz bewusst.', 'Cho mảnh tối thứ hai. Thật chú tâm.'),
      l('me', 'Für das Stück.', 'Vì mảnh đá.'),
    ], post: { de: 'Einundachtzig. Das Stück leuchtet auf, bernsteinfarben.', vi: 'Tám mươi mốt. Mảnh đá bừng sáng màu hổ phách.' } },
  ],
  82: [
    { pre: [
      l('v', 'Der Sturm ist jetzt ganz nah. Die Wellen schlagen an den Turm.', 'Cơn bão đã rất gần. Sóng đập vào chân tháp.'),
      l('p', 'Ich sehe Boote! Draußen auf dem Meer! Sie suchen den Hafen.', 'Tớ thấy thuyền! Ngoài biển! Họ đang tìm bến cảng.'),
      l('me', 'Wir brauchen Licht!', 'Mình cần ánh sáng!'),
    ], post: { de: 'Der Stein ist noch nicht fertig. Aber Ilse hat eine Idee: die Handlaterne vom Hafen.', vi: 'Hòn đá chưa xong. Nhưng Ilse có một ý: chiếc đèn xách tay từ bến cảng.' } },
    { pre: [
      l('v', 'Ich steige auf den Rundgang. Im Sturm. Mit der Laterne.', 'Mình ra ban công vòng tháp. Trong bão. Với chiếc đèn.'),
      l('p', 'Bist du verrückt?', 'Cậu điên à?'),
      l('me', 'Er ist bereit.', 'Bạn ấy sẵn sàng rồi.'),
    ], post: { de: 'Vestibu hält sich am Geländer und steht fest im Wind. Die Laterne leuchtet über das Meer.', vi: 'Vestibu bám lan can và đứng vững trong gió. Chiếc đèn soi sáng mặt biển.' } },
    { pre: [
      l('v', 'Die Boote drehen bei! Sie sehen uns!', 'Thuyền đổi hướng rồi! Họ thấy bọn mình!'),
      l('me', 'Halte durch!', 'Cố lên!'),
    ], post: { de: 'Alle Boote finden heim. Und das dritte dunkle Stück leuchtet auf – zweiundachtzig.', vi: 'Mọi con thuyền đều về tới nhà. Và mảnh tối thứ ba sáng lên – tám mươi hai.' } },
  ],
  83: [
    { pre: [
      l('v', 'Nach der Nacht auf dem Rundgang bin ich müde.', 'Sau đêm trên ban công, mình mệt quá.'),
      l('p', 'Du warst ein Held. Ein nasser Held.', 'Cậu là anh hùng. Một anh hùng ướt sũng.'),
      l('me', 'Heute ruhen wir uns aus.', 'Hôm nay mình nghỉ ngơi.'),
    ], post: { de: 'Der Sturm macht eine Pause. Das Auge des Sturms – ganz still, blauer Himmel.', vi: 'Cơn bão tạm ngừng. Mắt bão – lặng như tờ, trời xanh ngắt.' } },
    { pre: [
      l('v', 'Sanfte Übungen. Ruhig atmen. Kraft sammeln.', 'Bài tập nhẹ. Thở đều. Tích sức.'),
      l('p', 'Wie auf der Wiese. Mit den Wolken.', 'Như trên đồng cỏ. Ngắm mây.'),
      l('me', 'Genau so.', 'Đúng vậy.'),
    ], post: { de: 'Ilse bringt heißen Tee. Wusel wärmt alle mit einer kleinen warmen Brise.', vi: 'Ilse mang trà nóng. Xoáy Nhỏ sưởi ấm mọi người bằng một làn gió nhẹ.' } },
    { pre: [
      l('v', 'Bald kommt die zweite Hälfte des Sturms. Wir sind bereit.', 'Sắp tới nửa sau cơn bão. Bọn mình sẵn sàng.'),
      l('me', 'Bereit.', 'Sẵn sàng.'),
    ], post: { de: 'Dreiundachtzig. Ein weiteres Stück glimmt auf, ganz sanft, wie ein Atemzug.', vi: 'Tám mươi ba. Thêm một mảnh le lói sáng, thật dịu, như một hơi thở.' } },
  ],
  84: [
    { pre: [
      l('v', 'Der Sturm kommt zurück. Stärker als vorher.', 'Cơn bão quay lại. Mạnh hơn trước.'),
      l('p', 'Und Wusel ist draußen!', 'Mà Xoáy Nhỏ đang ở ngoài!'),
      l('me', 'Wusel!', 'Xoáy Nhỏ!'),
    ], post: { de: 'Wusel kämpft mit dem fremden Sturm. Er wird hin und her geworfen.', vi: 'Xoáy Nhỏ vật lộn với cơn bão lạ. Nó bị quăng qua quật lại.' } },
    { pre: [
      l('v', 'Wusel hat vergessen, wie man ruhig bleibt. Wir müssen es ihm zeigen.', 'Xoáy Nhỏ quên cách giữ bình tĩnh rồi. Mình phải chỉ cho nó.'),
      l('p', 'Wie beim ersten Mal! Atmen!', 'Như lần đầu tiên! Thở nào!'),
      l('me', 'Ein, aus. Ein, aus.', 'Hít vào, thở ra. Hít vào, thở ra.'),
    ], post: { de: 'Am Fenster atmen alle langsam. Wusel sieht es. Er wird ruhiger.', vi: 'Bên cửa sổ, mọi người thở chậm. Xoáy Nhỏ nhìn thấy. Nó bình tĩnh dần.' } },
    { pre: [
      l('v', 'Und der fremde Sturm? Er schaut auch zu.', 'Còn cơn bão lạ? Nó cũng đang nhìn.'),
      l('me', 'Vielleicht lernt er es auch.', 'Có khi nó cũng học được.'),
    ], post: { de: 'Der fremde Sturm wird ein kleines bisschen langsamer. Vierundachtzig Stücke leuchten.', vi: 'Cơn bão lạ chậm lại một chút xíu. Tám mươi tư mảnh đã sáng.' } },
  ],
  85: [
    { pre: [
      l('v', 'Die größte Welle kommt. Sie trifft den Turm!', 'Con sóng lớn nhất đang tới. Nó đập vào tháp!'),
      l('p', 'Festhalten!', 'Bám chặt!'),
      l('me', 'Wir stehen!', 'Bọn mình đứng vững!'),
    ], post: { de: 'Der Turm bebt. Bücher fallen aus den Regalen. Aber niemand fällt.', vi: 'Tòa tháp rung lên. Sách rơi khỏi kệ. Nhưng không ai ngã.' } },
    { pre: [
      l('v', 'Der Stein! Er ist vom Sockel gerutscht!', 'Hòn đá! Nó trượt khỏi bệ rồi!'),
      l('p', 'NEIN! Fünfundachtzig Tage!', 'KHÔNG! Tám mươi lăm ngày!'),
      l('me', 'Wir fangen ihn!', 'Bắt lấy nó!'),
    ], post: { de: 'Vestibu springt nicht. Er macht einen sicheren, schnellen Schritt – und fängt den Stein.', vi: 'Vestibu không nhảy bổ tới. Cậu bước một bước nhanh và vững – và đỡ được hòn đá.' } },
    { pre: [
      l('v', 'Ich hab ihn. Ganz vorsichtig zurück auf den Sockel.', 'Mình giữ được rồi. Thật nhẹ nhàng đặt lại lên bệ.'),
      l('me', 'Ruhig. Ganz ruhig.', 'Bình tĩnh. Thật bình tĩnh.'),
    ], post: { de: 'Der Stein sitzt wieder. Kein Stück ist verloren. Und eines mehr leuchtet: fünfundachtzig.', vi: 'Hòn đá đã về chỗ. Không mất mảnh nào. Và thêm một mảnh sáng lên: tám mươi lăm.' } },
  ],
  86: [
    { pre: [
      l('v', 'Der Sturm wird schwächer. Hörst du?', 'Cơn bão yếu dần. Bạn nghe không?'),
      l('p', 'Er heult nicht mehr. Er … summt?', 'Nó không hú nữa. Nó … ngân nga?'),
      l('me', 'Er hat zugeschaut.', 'Nó đã nhìn theo bọn mình.'),
    ], post: { de: 'Der fremde Sturm dreht sich langsamer und langsamer. Wie Wusel damals.', vi: 'Cơn bão lạ xoay chậm dần, chậm dần. Như Xoáy Nhỏ ngày trước.' } },
    { pre: [
      l('v', 'Wusel tanzt mit ihm. Ganz langsam.', 'Xoáy Nhỏ khiêu vũ cùng nó. Thật chậm rãi.'),
      l('p', 'Hat Wusel einen neuen Freund?', 'Xoáy Nhỏ có bạn mới rồi à?'),
      l('me', 'Sieht so aus.', 'Có vẻ là vậy.'),
    ], post: { de: 'Die Wolken reißen auf. Ein Regenbogen spannt sich über die Insel.', vi: 'Mây tan dần. Một cầu vồng vắt ngang hòn đảo.' } },
    { pre: [
      l('v', 'Der Sturm ist vorbei. Und der Turm steht.', 'Cơn bão đã qua. Và tòa tháp vẫn đứng.'),
      l('me', 'Wir auch.', 'Bọn mình cũng vậy.'),
    ], post: { de: 'Sechsundachtzig. Das Stück leuchtet in allen Farben des Regenbogens.', vi: 'Tám mươi sáu. Mảnh đá sáng lên đủ bảy sắc cầu vồng.' } },
  ],
  87: [
    { pre: [
      l('v', 'Nach dem Sturm ist alles ruhig. Noch drei Tage.', 'Sau bão mọi thứ yên bình. Còn ba ngày nữa.'),
    ], post: { de: 'Ilse schreibt Einladungen für den neunzigsten Tag. An alle auf der Insel.', vi: 'Ilse viết thiệp mời cho ngày thứ chín mươi. Gửi mọi người trên đảo.' } },
    { pre: [
      l('v', 'Pip, du bist die Post. Diesmal ist es eine große Aufgabe.', 'Pip, cậu là bưu tá. Lần này là nhiệm vụ lớn đấy.'),
      l('me', 'Danke, Pip!', 'Cảm ơn Pip!'),
    ], post: { de: 'Pip fliegt los, den Schnabel voller Karten.', vi: 'Pip cất cánh, mỏ ngậm đầy thiệp.' } },
    { pre: [
      l('v', 'Die Einladungen sehen aus wie deine erste Karte. Mit dem Muschelzeichen.', 'Những tấm thiệp trông giống tấm đầu tiên của bạn. Có dấu vỏ sò.'),
      l('me', 'Aber diesmal nicht leer.', 'Nhưng lần này không trắng nữa.'),
    ], post: { de: 'Auf jeder steht: „Kommt zum Licht.“ Siebenundachtzig Stücke leuchten.', vi: 'Trên mỗi tấm ghi: “Hãy tới với ánh sáng.” Tám mươi bảy mảnh đã sáng.' } },
  ],
  88: [
    { pre: [
      l('v', 'Ilse will dir etwas zeigen. Ganz oben, über der Lampe.', 'Ilse muốn cho bạn xem một thứ. Tít trên cao, phía trên ngọn đèn.'),
      l('p', 'Es gibt noch ein „über der Lampe“?', 'Còn có “phía trên ngọn đèn” nữa à?'),
      l('me', 'Zeig es mir.', 'Cho mình xem.'),
    ], post: { de: 'Eine kleine Tür führt hinaus auf die Aussichtsplattform – mit hohem Geländer.', vi: 'Một cánh cửa nhỏ dẫn ra đài ngắm cảnh – có lan can cao.' } },
    { pre: [
      l('v', 'Hier oben steht man ganz allein mit dem Himmel. Ilse hat das jeden Tag gemacht.', 'Trên này chỉ có mình với bầu trời. Ilse ngày nào cũng làm vậy.'),
      l('me', 'Ich stehe hier. Ruhig.', 'Mình đứng đây. Bình thản.'),
    ], post: { de: 'Von hier sieht man alles: Hafen, Wald, Meer. Jeder Ort eine Erinnerung.', vi: 'Từ đây thấy tất cả: bến cảng, khu rừng, biển. Mỗi nơi một kỷ niệm.' } },
    { pre: [
      l('v', 'Ilse sagt, wer hier oben steht, ist bereit, den Leuchtturm zu pflegen.', 'Ilse bảo ai đứng được trên này là sẵn sàng chăm sóc hải đăng.'),
      l('me', 'Ich?', 'Mình á?'),
    ], post: { de: 'Ilse lächelt nur. Achtundachtzig. Zwei Stücke noch.', vi: 'Ilse chỉ mỉm cười. Tám mươi tám. Còn hai mảnh.' } },
  ],
  89: [
    { pre: [
      l('v', 'Die Gäste kommen! Boote vom Hafen, Tiere aus dem Wald.', 'Khách tới rồi! Thuyền từ bến cảng, muông thú từ khu rừng.'),
      l('me', 'Alle sind da!', 'Mọi người đều tới!'),
    ], post: { de: 'Der Leuchtturm ist voller Freunde. Jeder hat einen Teil der Reise begleitet.', vi: 'Hải đăng đầy ắp bạn bè. Ai cũng đã đồng hành một phần chặng đường.' } },
    { pre: [
      l('v', 'Bruno hat einen riesigen Kuchen gebacken. In Form des Leuchtturms.', 'Bruno nướng một chiếc bánh khổng lồ. Hình ngọn hải đăng.'),
    ], post: { de: 'Alle üben gemeinsam ein letztes Mal vor dem großen Tag. Ein ganzer Leuchtturm voller Einbeiniger.', vi: 'Mọi người cùng tập lần cuối trước ngày trọng đại. Cả tòa hải đăng toàn người đứng một chân.' } },
    { pre: [
      l('v', 'Morgen ist der neunzigste Tag. Wie fühlst du dich?', 'Mai là ngày thứ chín mươi. Bạn thấy sao?'),
      l('me', 'Stark. Und ein bisschen aufgeregt.', 'Vững vàng. Và hơi hồi hộp.'),
    ], post: { de: 'Neunundachtzig. Das vorletzte Stück leuchtet. Das letzte liegt noch dunkel in deiner Hand.', vi: 'Tám mươi chín. Mảnh áp chót đã sáng. Mảnh cuối cùng vẫn còn tối trong tay bạn.' } },
  ],
  90: [
    { pre: [
      l('v', 'Neunzig Tage. Erinnerst du dich an den ersten?', 'Chín mươi ngày. Bạn còn nhớ ngày đầu tiên không?'),
      l('me', 'Und ich konnte kaum stehen.', 'Còn mình thì đứng còn không vững.'),
      l('v', 'Und jetzt hältst du das letzte Stück.', 'Còn giờ bạn đang cầm mảnh cuối cùng.'),
    ], post: { de: 'Alle versammeln sich oben an der Lampe. Es wird ganz still.', vi: 'Mọi người tụ lại trên đỉnh, quanh ngọn đèn. Tất cả lặng im.' } },
    { pre: [
      l('v', 'Das letzte Stück leuchtet erst, wenn du heute übst. Ein letztes Mal.', 'Mảnh cuối chỉ sáng khi hôm nay bạn tập. Một lần cuối.'),
      l('p', 'Kein Druck. Nur die ganze Insel schaut zu.', 'Không áp lực đâu. Chỉ có cả hòn đảo đang nhìn thôi.'),
      l('me', 'Ich bin bereit.', 'Mình sẵn sàng.'),
    ], post: { de: 'Das Stück in deiner Hand wird warm. Ein zartes Licht beginnt zu leuchten.', vi: 'Mảnh đá trong tay bạn ấm dần. Một ánh sáng dịu bắt đầu le lói.' } },
    { pre: [
      l('v', 'Jetzt. Leg es auf den Stein.', 'Ngay bây giờ. Đặt nó lên hòn đá.'),
      l('me', 'Für die Insel.', 'Vì hòn đảo.'),
    ], post: { de: 'Der Stein ist ganz. Die Lampe leuchtet, hell über das ganze Meer. Die Insel steht still – und jeder auf ihr steht sicher. Ilse legt dir eine Karte in die Hand. Darauf steht dein Name, und darunter: „Leuchtturmwärter.“', vi: 'Hòn đá đã liền lại. Ngọn đèn bừng sáng khắp mặt biển. Hòn đảo đứng yên – và ai trên đảo cũng đứng vững. Ilse đặt vào tay bạn một tấm thiệp. Trên đó ghi tên bạn, và bên dưới: “Người giữ hải đăng.”' } },
  ],
}
