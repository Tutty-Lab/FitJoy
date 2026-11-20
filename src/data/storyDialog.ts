import type { Copy } from './story'
import { harborDialog } from './storyHarbor'
import { forestDialog } from './storyForest'
import { lighthouseDialog } from './storyLighthouse'

// Story as conversations. Cast:
//   v  = Vestibu, the balance helper (calm, warm, a little clumsy)
//   p  = Pip, a cheeky seagull who "borrows" things and knows every corner of the island
//   me = the player (their reply is the button they tap)
// Premise: a storm knocked the island's Balance Stone into pieces. Without it the island sways,
// the lighthouse is dark and the post no longer arrives. Every practice steadies Vestibu enough
// to find and carry back one piece. Each session ends on a small hook for the next one.
export type Who = 'v' | 'p' | 'me'
export type Line = { who: Who; de: string; vi: string }
export type SessionScene = { pre: Line[]; post: Copy }

const l = (who: Who, de: string, vi: string): Line => ({ who, de, vi })

export const storyDialog: Record<number, SessionScene[]> = {
  1: [
    { pre: [
      l('v', 'Hallo! Ich bin Vestibu. Spürst du das? Die ganze Insel schwankt ein bisschen.', 'Chào bạn! Mình là Vestibu. Bạn có thấy không? Cả hòn đảo đang hơi chao đảo.'),
      l('v', 'Letzte Nacht hat ein Sturm den Gleichgewichtsstein zerbrochen. Seitdem ist alles wackelig – und der Leuchtturm ist dunkel.', 'Đêm qua một cơn bão đã làm vỡ Hòn Đá Thăng Bằng. Từ đó mọi thứ chòng chành – và ngọn hải đăng tắt ngấm.'),
      l('me', 'Wie kann ich helfen?', 'Mình giúp được gì?'),
      l('v', 'Wenn du sicher stehst, stehe ich auch sicher. Dann kann ich die Stücke suchen. Fangen wir mit einer Minute an?', 'Khi bạn đứng vững, mình cũng đứng vững. Lúc đó mình mới đi tìm các mảnh đá được. Mình bắt đầu bằng một phút nhé?'),
    ], post: { de: 'Der Boden hört kurz auf zu schwanken. Im Nebel blinkt etwas Helles am Steg …', vi: 'Mặt đất ngừng chao trong chốc lát. Trong sương, có gì đó lấp lánh ở cầu tàu …' } },
    { pre: [
      l('v', 'Da vorne am Steg – siehst du das Glitzern?', 'Đằng kia, ở cầu tàu – bạn thấy ánh lấp lánh không?'),
      l('p', 'Kraah! Meins! Glitzerding gefunden!', 'Quác! Của tớ! Tớ tìm thấy đồ lấp lánh rồi!'),
      l('v', 'Oh nein, eine Möwe! Das ist das erste Stück vom Stein!', 'Ôi không, một con hải âu! Đó là mảnh đá đầu tiên!'),
      l('me', 'Schnell hinterher!', 'Đuổi theo mau!'),
      l('v', 'Langsam, langsam. Auf wackeligem Boden rennt man nicht. Erst sicher stehen – dann folgen wir ihr.', 'Từ từ thôi. Trên mặt đất chòng chành thì không chạy được. Đứng vững trước đã – rồi mình theo nó.'),
    ], post: { de: 'Die Möwe landet auf der alten Laterne und lässt das Stück nicht los. „Tauschen?“, krächzt sie.', vi: 'Con hải âu đậu lên chiếc đèn cũ, không chịu nhả mảnh đá. “Đổi không?”, nó kêu.' } },
    { pre: [
      l('p', 'Ich bin Pip. Ich tausche Glitzer nur gegen Licht.', 'Tớ là Pip. Tớ chỉ đổi đồ lấp lánh lấy ánh sáng thôi.'),
      l('v', 'Licht? Die Hafenlaterne ist aus, seit der Sturm kam.', 'Ánh sáng à? Đèn bến cảng tắt từ khi bão tới rồi.'),
      l('me', 'Dann zünden wir sie an!', 'Vậy mình thắp nó lên!'),
      l('v', 'Genau. Mit ruhigen Händen schaffe ich das. Eine letzte Minute für heute!', 'Đúng vậy. Tay vững thì mình làm được. Một phút cuối cho hôm nay nhé!'),
    ], post: { de: 'Die Laterne leuchtet! Pip lässt das Stück fallen – und darunter liegt eine leere Postkarte mit einem Muschelzeichen. Wer hat sie geschickt?', vi: 'Đèn sáng rồi! Pip thả mảnh đá xuống – bên dưới là một tấm bưu thiếp trắng có dấu vỏ sò. Ai đã gửi nó?' } },
  ],
  2: [
    { pre: [
      l('p', 'Kraah! Guten Morgen, ihr Wackelbeine!', 'Quác! Chào buổi sáng, hai cái chân run!'),
      l('v', 'Pip ist wieder da. Und schau: unser Boot treibt weg, die Leine ist gerissen!', 'Pip lại tới rồi. Mà nhìn kìa: thuyền của mình đang trôi đi, dây buộc bị đứt!'),
      l('me', 'Was brauchen wir?', 'Mình cần gì?'),
      l('v', 'Einen Anker. Pip sagt, im Sand liegt einer – irgendwo.', 'Một cái neo. Pip bảo có một cái nằm trong cát – ở đâu đó.'),
    ], post: { de: 'Vestibu gräbt und gräbt. Da! Eine rostige Kette schaut aus dem Sand.', vi: 'Vestibu đào mãi. Kia rồi! Một sợi xích gỉ lộ ra khỏi cát.' } },
    { pre: [
      l('v', 'Der Anker ist schwer. Wenn ich wackle, falle ich mit ihm um.', 'Cái neo nặng quá. Nếu mình chao, mình sẽ ngã cùng nó mất.'),
      l('p', 'Tipp vom Profi: ein Bein fest, Blick nach vorn. So stehe ich auf Masten!', 'Mẹo của dân chuyên: một chân chắc, mắt nhìn thẳng. Tớ đứng trên cột buồm kiểu vậy đấy!'),
      l('me', 'Das probieren wir.', 'Mình thử xem.'),
    ], post: { de: 'Mit einem Ruck ist der Anker frei. Das Boot dreht sich langsam zurück zum Steg.', vi: 'Giật một cái, chiếc neo bật ra. Con thuyền từ từ quay về cầu tàu.' } },
    { pre: [
      l('v', 'Fast geschafft. Nur noch den Anker ins Boot heben.', 'Sắp xong rồi. Chỉ còn nhấc neo lên thuyền.'),
      l('p', 'Und dann? Dann gibt’s Fisch?', 'Rồi sao nữa? Có cá ăn không?'),
      l('me', 'Erst der Anker, Pip!', 'Neo trước đã, Pip!'),
    ], post: { de: 'Das Boot liegt fest. Unter der Sitzbank klebt ein zweites Steinstück – und eine Kritzelei: eine Brücke, die im Nebel endet.', vi: 'Thuyền đã neo chắc. Dưới ghế ngồi dính mảnh đá thứ hai – kèm một nét vẽ: cây cầu biến mất trong sương.' } },
  ],
  3: [
    { pre: [
      l('v', 'Die Zeichnung von gestern … diese Brücke gab es hier mal. Jetzt fehlen die Bretter.', 'Hình vẽ hôm qua … cây cầu này từng có ở đây. Giờ thì mất hết ván rồi.'),
      l('p', 'Bretter hab ich gesehen! Im Wasser. Geschwommen sind sie.', 'Tớ thấy ván rồi! Ở dưới nước. Chúng trôi lềnh bềnh.'),
      l('me', 'Fischen wir sie raus!', 'Vớt lên thôi!'),
    ], post: { de: 'Das erste Brett ist geborgen. Es trägt ein eingeritztes Muschelzeichen – wie die Postkarte.', vi: 'Tấm ván đầu tiên đã được vớt. Trên đó khắc dấu vỏ sò – giống hệt tấm bưu thiếp.' } },
    { pre: [
      l('v', 'Noch zwei Bretter. Wer hat wohl dieses Zeichen hineingeritzt?', 'Còn hai tấm nữa. Ai đã khắc dấu này nhỉ?'),
      l('p', 'Ich weiß es. Aber ich sag’s nicht. Erst Fisch.', 'Tớ biết đấy. Nhưng tớ không nói đâu. Cho cá trước.'),
      l('me', 'Pip, du bist unmöglich.', 'Pip, cậu thật hết nói.'),
    ], post: { de: 'Pip zwinkert: „Der Leuchtturm weiß es auch.“ Dann fliegt er davon.', vi: 'Pip nháy mắt: “Ngọn hải đăng cũng biết đấy.” Rồi nó bay mất.' } },
    { pre: [
      l('v', 'Das letzte Brett für heute. Dann können wir bis zur Nebelgrenze laufen.', 'Tấm ván cuối cho hôm nay. Rồi mình đi được tới mép sương.'),
      l('me', 'Los, ein sicherer Schritt nach dem anderen.', 'Đi nào, từng bước thật vững.'),
    ], post: { de: 'Der Steg reicht jetzt bis in den Nebel. Ganz hinten blinkt etwas: das dritte Stück!', vi: 'Cầu tàu giờ đã dài tới tận làn sương. Tít phía xa có gì đó nhấp nháy: mảnh thứ ba!' } },
  ],
  4: [
    { pre: [
      l('v', 'Hörst du das? Der Wind singt heute ein seltsames Lied.', 'Bạn nghe không? Hôm nay gió hát một bài lạ lắm.'),
      l('p', 'Das ist kein Wind. Das ist das alte Windspiel. Es ruft.', 'Đó không phải gió. Đó là cái chuông gió cũ. Nó đang gọi.'),
      l('me', 'Wen ruft es?', 'Nó gọi ai?'),
      l('v', 'Vielleicht uns. Folgen wir dem Klang.', 'Có lẽ là gọi mình. Đi theo tiếng chuông nào.'),
    ], post: { de: 'Am Ende des Stegs hängt das Windspiel kopfüber an einem Pfahl. Ein Glöckchen fehlt.', vi: 'Cuối cầu tàu, chiếc chuông gió treo ngược trên cột. Thiếu mất một quả chuông nhỏ.' } },
    { pre: [
      l('v', 'Ohne das Glöckchen klingt es traurig. Pip, hast du es etwa …?', 'Thiếu quả chuông, nó kêu buồn quá. Pip, cậu có phải đã …?'),
      l('p', 'Ich? Nie! … Na gut. Vielleicht. Es glänzt so schön.', 'Tớ á? Không đời nào! … Thôi được. Có lẽ. Nó sáng đẹp quá mà.'),
      l('me', 'Gib es zurück, Pip.', 'Trả lại đi, Pip.'),
    ], post: { de: 'Pip gibt das Glöckchen schmollend zurück. Darin klappert etwas Kleines, Schweres.', vi: 'Pip phụng phịu trả lại quả chuông. Bên trong có thứ gì nhỏ mà nặng kêu lạch cạch.' } },
    { pre: [
      l('v', 'Ich muss das Windspiel ganz ruhig wieder aufhängen, sonst verheddert sich alles.', 'Mình phải treo chuông gió lại thật bình tĩnh, không là rối hết.'),
      l('me', 'Ruhige Hände – ich bin dabei.', 'Tay vững – có mình đây.'),
    ], post: { de: 'Das Windspiel klingt wieder hell. Aus dem Glöckchen rollt das vierte Steinstück. Der Wind dreht – Richtung Leuchtturm.', vi: 'Chuông gió lại reo trong trẻo. Từ quả chuông lăn ra mảnh đá thứ tư. Gió đổi hướng – về phía hải đăng.' } },
  ],
  5: [
    { pre: [
      l('v', 'Weißt du noch, die leere Postkarte? Heute schreiben wir eine Antwort.', 'Bạn còn nhớ tấm bưu thiếp trắng không? Hôm nay mình viết hồi âm.'),
      l('p', 'An wen? Da steht kein Name.', 'Gửi ai? Có ghi tên đâu.'),
      l('me', 'An den, der das Muschelzeichen kennt.', 'Gửi người biết dấu vỏ sò.'),
    ], post: { de: 'Vestibu schreibt: „Wir haben deine Karte gefunden. Wir helfen der Insel. Wer bist du?“', vi: 'Vestibu viết: “Bọn mình đã thấy tấm thiệp của bạn. Bọn mình đang giúp hòn đảo. Bạn là ai?”' } },
    { pre: [
      l('v', 'Jetzt brauchen wir jemanden, der die Karte zustellt.', 'Giờ cần ai đó mang thiệp đi.'),
      l('p', 'Postmöwe Pip, zu Diensten! … Gegen Bezahlung.', 'Hải âu đưa thư Pip xin phục vụ! … Có tính phí đấy.'),
      l('me', 'Ein Fisch?', 'Một con cá nhé?'),
      l('p', 'Zwei.', 'Hai con.'),
    ], post: { de: 'Pip fliegt los, die Karte im Schnabel – direkt in den Nebel hinein.', vi: 'Pip cất cánh, ngậm tấm thiệp – bay thẳng vào làn sương.' } },
    { pre: [
      l('v', 'Hoffentlich kommt Pip zurück. Bleiben wir so lange ruhig und stark.', 'Mong Pip quay lại. Trong lúc chờ, mình cứ bình tĩnh và vững vàng nhé.'),
      l('me', 'Wir warten zusammen.', 'Mình chờ cùng nhau.'),
    ], post: { de: 'Kurz vor Sonnenuntergang landet Pip. Er bringt das fünfte Stück – und eine Feder, die bläulich leuchtet.', vi: 'Gần hoàng hôn, Pip đáp xuống. Nó mang về mảnh đá thứ năm – và một chiếc lông vũ phát sáng xanh.' } },
  ],
  6: [
    { pre: [
      l('v', 'Puh. Fünf Tage, fünf Stücke. Meine Beine sind müde.', 'Phù. Năm ngày, năm mảnh đá. Chân mình mỏi rồi.'),
      l('p', 'Müde Beine brauchen eine Bank. Eine Bank gibt’s hier nicht.', 'Chân mỏi thì cần ghế. Ở đây làm gì có ghế.'),
      l('me', 'Dann bauen wir eine.', 'Vậy mình làm một cái.'),
    ], post: { de: 'Aus Treibholz entsteht ein Gerüst. Es wackelt noch – wie die ganze Insel.', vi: 'Từ gỗ trôi dạt, một khung ghế thành hình. Nó còn lắc – như cả hòn đảo vậy.' } },
    { pre: [
      l('v', 'Eine Bank, die wackelt, ist keine Pause. Wir brauchen ein festes Bein.', 'Ghế mà lắc thì nghỉ sao được. Cần một cái chân thật chắc.'),
      l('p', 'Wie bei dir heute! Du stehst schon viel sicherer.', 'Như cậu hôm nay ấy! Cậu đứng vững hơn nhiều rồi.'),
      l('me', 'Danke, Pip.', 'Cảm ơn Pip.'),
    ], post: { de: 'Ein dicker Stein unter dem Bein – die Bank steht. Zum ersten Mal sitzen alle drei nebeneinander.', vi: 'Kê một hòn đá to dưới chân – ghế đã vững. Lần đầu tiên cả ba ngồi cạnh nhau.' } },
    { pre: [
      l('v', 'Pausen gehören dazu. Wer ausruht, steht morgen wieder fester.', 'Nghỉ ngơi cũng là một phần. Ai nghỉ ngơi, mai sẽ đứng vững hơn.'),
      l('me', 'Eine letzte ruhige Runde.', 'Một lượt cuối thật thong thả.'),
    ], post: { de: 'In der Bank steckt das sechste Stück. Pip flüstert: „Morgen kommt jemand mit dem Boot.“', vi: 'Trong ghế có mảnh đá thứ sáu. Pip thì thầm: “Mai sẽ có người tới bằng thuyền.”' } },
  ],
  7: [
    { pre: [
      l('p', 'Kraah! Segel am Horizont! Ich hab’s doch gesagt!', 'Quác! Có cánh buồm phía chân trời! Tớ đã bảo mà!'),
      l('v', 'Ein Boot! Aber der Hafen hat keine Flagge – sie finden uns im Nebel nicht.', 'Một chiếc thuyền! Nhưng bến không có cờ – họ không tìm thấy mình trong sương đâu.'),
      l('me', 'Dann setzen wir die Flagge!', 'Vậy mình cắm cờ!'),
    ], post: { de: 'Die alte Flagge liegt verknotet im Bootsschuppen. Jeder Knoten braucht Geduld.', vi: 'Lá cờ cũ nằm rối trong kho thuyền. Mỗi nút thắt cần kiên nhẫn.' } },
    { pre: [
      l('v', 'Die Flagge muss ganz nach oben. Dafür stehe ich auf den Zehenspitzen.', 'Lá cờ phải kéo lên tận đỉnh. Mình phải kiễng chân mới được.'),
      l('p', 'Ich halte die Ecke! … Oder ich fliege einfach hoch. Das geht auch.', 'Tớ giữ góc cho! … Hoặc tớ bay lên luôn. Cũng được.'),
      l('me', 'Zusammen schaffen wir das.', 'Cùng nhau mình làm được.'),
    ], post: { de: 'Die Flagge weht! Das Boot dreht bei und hält genau auf unseren Hafen zu.', vi: 'Lá cờ tung bay! Con thuyền đổi hướng, lái thẳng vào bến của mình.' } },
    { pre: [
      l('v', 'Sieben Tage. Sieben Stücke. Der Hafen ist wach.', 'Bảy ngày. Bảy mảnh đá. Bến cảng đã thức giấc.'),
      l('p', 'Und gleich lernen wir den Postboten kennen!', 'Và sắp được gặp người đưa thư rồi!'),
      l('me', 'Ich bin gespannt!', 'Mình háo hức quá!'),
    ], post: { de: 'Aus dem Boot steigt niemand. Nur ein Brief liegt darin: „Kommt zum Leuchtturm. Bringt den Stein mit. – Ilse“', vi: 'Không ai bước xuống thuyền. Chỉ có một lá thư: “Hãy tới hải đăng. Mang theo hòn đá. – Ilse”' } },
  ],
}

Object.assign(storyDialog, harborDialog, forestDialog, lighthouseDialog)

export const dialogFor = (day: number, session: number): SessionScene | undefined => storyDialog[day]?.[session - 1]
