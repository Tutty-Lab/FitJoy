import { useState } from 'react'
import { createPortal } from 'react-dom'
import { loadProfile } from '../lib/profile'
import { playGameSound } from '../lib/gameAudio'
import { L } from '../lib/i18n'
import type { Region } from '../data/story'

// Hidden discoveries on the map. Two kinds of markers:
//  • 'spark' – a soft twinkle you may notice by chance
//  • 'alert' – a gentle "!" badge that invites a tap
// Tapping opens a little story card with a close-up of that exact spot on the map
// (a zoomed crop of the painted scene – no extra image assets needed) and a few warm lines.
type Kind = 'spark' | 'alert'
type Spot = {
  x: number; y: number; kind: Kind
  titleDe: string; titleVi: string
  deepDe: string; deepVi: string
}

const HOTSPOTS: Record<Region['id'], Spot[]> = {
  harbor: [ // inside the cozy house
    { x: 22, y: 6, kind: 'alert', titleDe: 'Der singende Kessel', titleVi: 'Chiếc ấm biết hát',
      deepDe: 'Auf dem Herd pfeift ein alter Kupferkessel. „Zeit für Tee!“, ruft er jeden Nachmittag – und erinnert dich daran, kurz innezuhalten und tief zu atmen.',
      deepVi: 'Trên bếp, chiếc ấm đồng cũ reo lên. “Đến giờ trà rồi!” – nó gọi mỗi buổi chiều, nhắc bạn dừng lại một chút và hít thở thật sâu.' },
    { x: 46, y: 35, kind: 'spark', titleDe: 'Mimi schläft', titleVi: 'Mèo Mimi đang ngủ',
      deepDe: 'Die kleine Katze Mimi hat sich im warmen Sonnenfleck zusammengerollt. Sie träumt von Fischen und wackelt dabei mit den Ohren. Psst – nicht wecken.',
      deepVi: 'Cô mèo nhỏ Mimi cuộn tròn trong vệt nắng ấm. Nó mơ thấy đàn cá và khẽ ve vẩy tai. Suỵt – đừng đánh thức nhé.' },
    { x: 57, y: 51, kind: 'alert', titleDe: 'Die schwebende Tasse', titleVi: 'Tách trà lơ lửng',
      deepDe: 'Eine Teetasse schwebt ganz ruhig in der Luft, als hinge sie an einem unsichtbaren Faden. In diesem Haus darf auch das Unmögliche kurz Pause machen.',
      deepVi: 'Một tách trà lơ lửng thật yên trong không khí, như treo trên sợi chỉ vô hình. Trong ngôi nhà này, cả điều không thể cũng được phép nghỉ ngơi một lát.' },
    { x: 71, y: 56, kind: 'spark', titleDe: 'Eine flinke Maus', titleVi: 'Chú chuột nhanh nhẹn',
      deepDe: 'Hinter der Kommode huscht eine kleine Maus vorbei – mit einem Krümel Keks im Maul. Sie nickt dir kurz zu und verschwindet in ihrem Loch.',
      deepVi: 'Sau tủ gỗ, một chú chuột nhỏ chạy vụt qua – ngậm theo mẩu bánh quy. Nó khẽ gật đầu chào bạn rồi biến vào hang.' },
    { x: 60, y: 84, kind: 'alert', titleDe: 'Das Fernrohr', titleVi: 'Chiếc kính ngắm sao',
      deepDe: 'Am Dachfenster steht ein Messingfernrohr. Richte es zum Himmel – heute Nacht sieht man sogar den Großen Wagen über dem Hafen blinken.',
      deepVi: 'Bên ô cửa mái có một chiếc kính đồng. Hướng nó lên trời – đêm nay có thể thấy cả chòm Gấu Lớn lấp lánh trên bến cảng.' },
    { x: 14, y: 20, kind: 'spark', titleDe: 'Omas Fotowand', titleVi: 'Bức tường ảnh của bà',
      deepDe: 'Unzählige kleine Rahmen hängen an der Wand – Urlaube, Hochzeiten, lachende Kinder. Jedes Bild ist eine Geschichte, die hier noch lebt.',
      deepVi: 'Vô số khung ảnh nhỏ treo trên tường – những chuyến đi, đám cưới, lũ trẻ cười vang. Mỗi tấm là một câu chuyện vẫn còn sống ở đây.' },
    { x: 33, y: 72, kind: 'spark', titleDe: 'Der Schaukelstuhl', titleVi: 'Chiếc ghế bập bênh',
      deepDe: 'Ein Schaukelstuhl wiegt sich sanft hin und her, ganz von allein. Vielleicht sitzt dort jemand, den nur das Haus noch sehen kann.',
      deepVi: 'Chiếc ghế bập bênh đung đưa nhẹ nhàng, tự nó chuyển động. Có lẽ ai đó đang ngồi đó, chỉ ngôi nhà mới còn nhìn thấy.' },
    { x: 84, y: 66, kind: 'alert', titleDe: 'Die warme Teekanne', titleVi: 'Ấm trà còn ấm',
      deepDe: 'Auf dem Ofen dampft eine bauchige Teekanne. Ihr Duft nach Kamille und Honig zieht durchs ganze Haus. Gönn dir eine Tasse – du hast sie verdient.',
      deepVi: 'Trên bếp lò, ấm trà bụng tròn đang bốc khói. Mùi hoa cúc và mật ong lan khắp nhà. Hãy tự thưởng một tách – bạn xứng đáng mà.' },
    { x: 80, y: 12, kind: 'spark', titleDe: 'Getrocknete Kräuter', titleVi: 'Bó thảo mộc treo',
      deepDe: 'Unter der Decke hängen Bündel aus Lavendel und Thymian zum Trocknen. Reibt man sie zwischen den Fingern, riecht die ganze Küche nach Sommer.',
      deepVi: 'Dưới trần nhà treo những bó oải hương và cỏ xạ hương phơi khô. Vò nhẹ giữa các ngón tay, cả gian bếp thơm mùi mùa hè.' },
    { x: 11, y: 45, kind: 'alert', titleDe: 'Der Lesesessel', titleVi: 'Chiếc ghế đọc sách',
      deepDe: 'In der Ecke steht ein weicher Ohrensessel mit einer Wolldecke. Daneben wartet ein aufgeschlagenes Buch – lies ruhig die nächste Seite.',
      deepVi: 'Nơi góc phòng có chiếc ghế bành êm với tấm chăn len. Bên cạnh là cuốn sách đang mở – cứ thong thả đọc trang tiếp theo nhé.' },
    { x: 70, y: 75, kind: 'alert', titleDe: 'Die alte Standuhr', titleVi: 'Chiếc đồng hồ cây',
      deepDe: 'Eine große Standuhr tickt gemütlich vor sich hin. Zur vollen Stunde schlägt sie leise – ein freundliches Zeichen, kurz durchzuatmen.',
      deepVi: 'Chiếc đồng hồ cây to tích tắc khoan thai. Đến giờ tròn nó điểm chuông khe khẽ – một dấu hiệu thân thương để bạn thở ra một hơi.' },
    { x: 30, y: 92, kind: 'spark', titleDe: 'Der weiche Teppich', titleVi: 'Tấm thảm ấm',
      deepDe: 'Ein handgeknüpfter Teppich bedeckt den Holzboden. Barfuß darüber zu gehen fühlt sich an wie eine kleine Umarmung für die Füße.',
      deepVi: 'Tấm thảm dệt tay phủ lên sàn gỗ. Đi chân trần trên đó như một cái ôm nhỏ dành cho đôi bàn chân.' },
    { x: 90, y: 38, kind: 'spark', titleDe: 'Das Vogelhäuschen', titleVi: 'Ngôi nhà chim',
      deepDe: 'Vor dem Fenster hängt ein kleines Vogelhäuschen. Ein Spatz pickt Körner und schaut kurz herein, als wollte er Guten Morgen sagen.',
      deepVi: 'Ngoài cửa sổ treo một ngôi nhà chim nhỏ. Chú sẻ mổ hạt rồi ngó vào trong, như muốn chào bạn một câu “chào buổi sáng”.' },
  ],
  forest: [ // old village lane
    { x: 74, y: 6, kind: 'alert', titleDe: 'Die zerlaufende Turmuhr', titleVi: 'Đồng hồ tháp đang chảy',
      deepDe: 'Oben am Kirchturm scheint die Uhr zu schmelzen, als wäre die Zeit hier aus weichem Wachs. Niemand hat es eilig – und das ist auch gut so.',
      deepVi: 'Trên tháp chuông, chiếc đồng hồ như đang tan chảy, tựa thời gian ở đây làm bằng sáp mềm. Chẳng ai vội vã – và thế lại hay.' },
    { x: 17, y: 21, kind: 'spark', titleDe: 'Katze im Fenster', titleVi: 'Mèo bên cửa sổ',
      deepDe: 'In einem oberen Fenster sitzt eine getigerte Katze und beobachtet die Straße. Sie kennt jeden, der vorbeigeht, und verrät nichts.',
      deepVi: 'Bên khung cửa trên cao, một chú mèo vằn ngồi nhìn ra phố. Nó quen mặt mọi người qua lại, mà chẳng tiết lộ gì.' },
    { x: 53, y: 41, kind: 'alert', titleDe: 'Der fliegende Schirm', titleVi: 'Chiếc ô biết bay',
      deepDe: 'Ein roter Regenschirm segelt über die Dächer, obwohl gar kein Wind weht. Vielleicht sucht er jemanden, der einen Spaziergang wagen möchte.',
      deepVi: 'Một chiếc ô đỏ bay lượn trên mái nhà, dù chẳng có gió. Có lẽ nó đang tìm ai đó muốn thử dạo một vòng.' },
    { x: 28, y: 69, kind: 'spark', titleDe: 'Rosen am Tor', titleVi: 'Hoa hồng bên cổng',
      deepDe: 'Rote Rosen ranken sich um ein altes Gartentor. Wer hier wohnt, gießt sie jeden Morgen und summt dabei ein altes Lied.',
      deepVi: 'Những đoá hồng đỏ leo quanh chiếc cổng vườn cũ. Người sống ở đây tưới chúng mỗi sáng và ngân nga một khúc hát xưa.' },
    { x: 66, y: 59, kind: 'spark', titleDe: 'Vogel auf dem Briefkasten', titleVi: 'Chim trên hòm thư',
      deepDe: 'Ein Rotkehlchen sitzt auf dem Briefkasten und zwitschert. Vielleicht kündigt es eine Postkarte an – von jemandem, der an dich denkt.',
      deepVi: 'Một chú chim ức đỏ đậu trên hòm thư và hót líu lo. Biết đâu nó báo tin một tấm bưu thiếp – từ người đang nghĩ đến bạn.' },
    { x: 44, y: 14, kind: 'alert', titleDe: 'Der Brunnen am Platz', titleVi: 'Giếng nước giữa quảng trường',
      deepDe: 'In der Mitte plätschert ein kleiner Brunnen. Manche werfen eine Münze hinein und wünschen sich etwas – heute darfst du das auch.',
      deepVi: 'Chính giữa quảng trường, một chiếc giếng nhỏ róc rách. Có người thả đồng xu và ước nguyện – hôm nay bạn cũng được phép đấy.' },
    { x: 86, y: 34, kind: 'spark', titleDe: 'Der Bäckerduft', titleVi: 'Mùi bánh mới nướng',
      deepDe: 'Aus der kleinen Bäckerei zieht der Duft von frischem Brot über die Gasse. Allein das Riechen macht schon ein bisschen glücklich.',
      deepVi: 'Từ tiệm bánh nhỏ, mùi bánh mì mới nướng lan khắp con hẻm. Chỉ ngửi thôi đã thấy vui vui.' },
    { x: 60, y: 82, kind: 'alert', titleDe: 'Die Bank unter dem Baum', titleVi: 'Ghế dưới tán cây',
      deepDe: 'Eine Holzbank steht im Schatten einer großen Linde. Hier haben sich schon viele ausgeruht – setz dich ruhig einen Moment dazu.',
      deepVi: 'Một chiếc ghế gỗ nằm dưới bóng cây đoan lớn. Bao người đã ngồi nghỉ ở đây – bạn cứ ghé lại một lát nhé.' },
    { x: 10, y: 50, kind: 'spark', titleDe: 'Blumenkästen', titleVi: 'Hộp hoa cửa sổ',
      deepDe: 'An jedem Fenster leuchten bunte Blumenkästen. Geranien, Petunien, ein bisschen Wildnis – die ganze Gasse blüht um die Wette.',
      deepVi: 'Mỗi ô cửa đều rực lên những hộp hoa đủ màu. Phong lữ, dã yên thảo, một chút hoang dại – cả con hẻm đua nhau khoe sắc.' },
    { x: 90, y: 71, kind: 'alert', titleDe: 'Die Gaslaterne', titleVi: 'Ngọn đèn đường',
      deepDe: 'An der Ecke steht eine alte Gaslaterne. Abends geht sie als Erste an und zeigt den Heimweg mit einem warmen, goldenen Licht.',
      deepVi: 'Nơi góc phố có ngọn đèn khí cũ. Chiều xuống nó sáng trước tiên, soi lối về nhà bằng thứ ánh vàng ấm áp.' },
    { x: 55, y: 26, kind: 'alert', titleDe: 'Der Wetterhahn', titleVi: 'Chong chóng gió',
      deepDe: 'Oben auf dem Dach dreht sich ein goldener Wetterhahn. Heute zeigt er nach Süden – ein guter Tag für einen kleinen Spaziergang.',
      deepVi: 'Trên nóc nhà, chú gà vàng chỉ hướng gió xoay tròn. Hôm nay nó chỉ về nam – một ngày đẹp để dạo bộ một vòng.' },
    { x: 22, y: 88, kind: 'spark', titleDe: 'Die Tauben', titleVi: 'Đàn bồ câu',
      deepDe: 'Auf dem Kopfsteinpflaster picken ein paar Tauben nach Krümeln. Kommst du näher, flattern sie auf und setzen sich zwei Schritte weiter.',
      deepVi: 'Trên nền đá lát, vài chú bồ câu mổ vụn bánh. Bạn lại gần, chúng vỗ cánh bay lên rồi đậu xuống cách đó hai bước.' },
    { x: 38, y: 54, kind: 'spark', titleDe: 'Das Ladenschild', titleVi: 'Tấm biển cửa tiệm',
      deepDe: 'Ein bemaltes Holzschild knarrt leise im Wind. „Krämerei“ steht darauf – drinnen gibt es Bonbons in großen Gläsern.',
      deepVi: 'Tấm biển gỗ sơn kẽo kẹt khe khẽ trong gió. Trên đó viết “Tạp hoá” – bên trong có kẹo đựng trong những lọ thuỷ tinh to.' },
  ],
  lighthouse: [ // dreamy park
    { x: 26, y: 10, kind: 'spark', titleDe: 'Enten auf dem Teich', titleVi: 'Đàn vịt trên hồ',
      deepDe: 'Eine Entenfamilie zieht ihre Runden auf dem spiegelglatten Teich. Die Küken paddeln hinterher und bleiben brav in einer Reihe.',
      deepVi: 'Một gia đình vịt bơi vòng quanh mặt hồ phẳng lặng. Lũ vịt con chèo theo sau, ngoan ngoãn xếp thành một hàng.' },
    { x: 50, y: 39, kind: 'alert', titleDe: 'Das leuchtende Papierboot', titleVi: 'Thuyền giấy phát sáng',
      deepDe: 'Ein kleines Papierboot treibt übers Wasser und leuchtet von innen. Wer es faltet, so sagt man, dem gehen stille Wünsche in Erfüllung.',
      deepVi: 'Chiếc thuyền giấy nhỏ trôi trên mặt nước và phát sáng từ bên trong. Người ta bảo ai gấp được nó, điều ước thầm kín sẽ thành sự thật.' },
    { x: 76, y: 28, kind: 'alert', titleDe: 'Die tropfende Gartenuhr', titleVi: 'Đồng hồ vườn nhỏ giọt',
      deepDe: 'Zwischen den Blumen hängt eine Uhr, die wie Honig langsam heruntertropft. Im Park darf die Zeit ganz gemächlich fließen.',
      deepVi: 'Giữa những khóm hoa treo một chiếc đồng hồ chảy chầm chậm như mật. Trong công viên, thời gian được phép trôi thật thong dong.' },
    { x: 20, y: 55, kind: 'spark', titleDe: 'Die schwebende Laterne', titleVi: 'Đèn lồng lơ lửng',
      deepDe: 'Eine Papierlaterne schwebt über dem Weg und wiegt sich im Abendlicht. Sie leuchtet denen heim, die ein wenig länger geblieben sind.',
      deepVi: 'Một chiếc đèn lồng giấy lơ lửng trên lối đi, đung đưa trong ánh chiều. Nó soi đường về cho những ai nán lại lâu hơn một chút.' },
    { x: 58, y: 79, kind: 'alert', titleDe: 'Das Picknick wartet', titleVi: 'Tấm khăn dã ngoại',
      deepDe: 'Auf der Wiese liegt eine karierte Decke mit Körbchen und Obst. Jemand hat Platz gelassen – vielleicht genau für dich.',
      deepVi: 'Trên bãi cỏ trải một tấm khăn kẻ ô với giỏ mây và trái cây. Ai đó đã chừa một chỗ – có lẽ dành riêng cho bạn.' },
    { x: 40, y: 20, kind: 'spark', titleDe: 'Der Drachen am Himmel', titleVi: 'Cánh diều trên trời',
      deepDe: 'Hoch oben tanzt ein bunter Drachen im Wind. Ein Kind hält die Schnur und lacht – und für einen Moment lachst du mit.',
      deepVi: 'Trên cao, một cánh diều nhiều màu nhảy múa trong gió. Một đứa trẻ cầm dây và cười vang – và thoáng chốc, bạn cũng cười theo.' },
    { x: 84, y: 60, kind: 'spark', titleDe: 'Der Eichhörnchen-Weg', titleVi: 'Lối của chú sóc',
      deepDe: 'Ein Eichhörnchen flitzt den Baumstamm hinauf, eine Nuss im Mund. Oben hat es ein geheimes Versteck für den Winter.',
      deepVi: 'Một chú sóc phóng lên thân cây, ngậm theo hạt dẻ. Trên cao nó có một kho bí mật để dành cho mùa đông.' },
    { x: 48, y: 58, kind: 'alert', titleDe: 'Der Wunschbaum', titleVi: 'Cây điều ước',
      deepDe: 'An einem alten Baum hängen bunte Bänder voller Wünsche. Binde in Gedanken auch deinen dazu – klein und leise ist völlig genug.',
      deepVi: 'Trên một cây cổ thụ treo đầy những dải ruy băng màu chứa lời ước. Hãy thầm buộc thêm điều ước của bạn – nhỏ bé và khẽ khàng là đủ rồi.' },
    { x: 68, y: 48, kind: 'spark', titleDe: 'Die Parkbank', titleVi: 'Ghế công viên',
      deepDe: 'Eine grüne Parkbank blickt auf den Teich. Hier füttert ein älterer Herr jeden Morgen die Enten und grüßt jeden mit einem Lächeln.',
      deepVi: 'Chiếc ghế công viên màu xanh hướng ra mặt hồ. Sáng nào một bác lớn tuổi cũng ra cho vịt ăn và chào mọi người bằng nụ cười.' },
    { x: 32, y: 72, kind: 'alert', titleDe: 'Der Springbrunnen', titleVi: 'Đài phun nước',
      deepDe: 'In der Mitte des Parks sprudelt ein Springbrunnen. Das Wasser glitzert in der Sonne und sein Plätschern macht die Gedanken ganz leicht.',
      deepVi: 'Giữa công viên, một đài phun nước tuôn trào. Dòng nước lấp lánh dưới nắng, tiếng róc rách làm lòng người nhẹ bẫng.' },
    { x: 12, y: 30, kind: 'spark', titleDe: 'Die Schmetterlinge', titleVi: 'Bầy bướm',
      deepDe: 'Über dem Lavendelbeet tanzen Schmetterlinge in Blau und Orange. Bleib einen Moment stehen – vielleicht setzt sich einer auf deine Hand.',
      deepVi: 'Trên luống oải hương, bầy bướm xanh và cam dập dờn. Hãy đứng lại một lát – biết đâu một chú sẽ đậu lên tay bạn.' },
    { x: 70, y: 90, kind: 'alert', titleDe: 'Der Holzsteg', titleVi: 'Cầu gỗ ra hồ',
      deepDe: 'Ein schmaler Holzsteg führt über das Wasser hinaus. Am Ende kann man die Füße baumeln lassen und den Libellen zusehen.',
      deepVi: 'Một chiếc cầu gỗ hẹp dẫn ra mặt nước. Ở cuối cầu, bạn có thể thả chân đung đưa và ngắm những chú chuồn chuồn.' },
    { x: 50, y: 7, kind: 'spark', titleDe: 'Die Pappelallee', titleVi: 'Hàng bạch dương',
      deepDe: 'Hohe Pappeln säumen den Weg und rauschen leise im Wind. Ihr Schatten begleitet dich wie ein kühler, freundlicher Tunnel.',
      deepVi: 'Hàng bạch dương cao viền hai bên lối đi, xào xạc khẽ trong gió. Bóng cây theo bạn như một đường hầm mát lành, thân thiện.' },
  ],
}

export default function MapHotspots({ region, flip }: { region: Region['id']; flip: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  const spots = HOTSPOTS[region] ?? []
  const tap = (i: number) => {
    if (loadProfile()?.chime ?? true) playGameSound('tap')
    setOpen(i)
  }
  const active = open != null ? spots[open] : null
  return <>
    {spots.map((s, i) => {
      const left = flip ? 100 - s.x : s.x
      return <button key={i} type="button" className={`map-spot map-spot-${s.kind}`} style={{ left: `${left}%`, top: `${s.y}%` }}
        aria-label={L(s.titleDe, s.titleVi)} onClick={() => tap(i)}>
        {s.kind === 'alert' ? <span className="map-spot-badge" aria-hidden="true">!</span> : <span className="map-spot-dot" aria-hidden="true" />}
      </button>
    })}
    {active && createPortal(
      <div className="map-spot-card-wrap" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
        <div className="map-spot-card" onClick={e => e.stopPropagation()}>
          <div className="map-spot-peek" aria-hidden="true" style={{
            backgroundImage: `url(/map/${region}.webp)`,
            backgroundPosition: `${flip ? 100 - active.x : active.x}% ${active.y}%`,
            transform: flip ? 'scaleX(-1)' : undefined,
          }} />
          <h3 className="map-spot-title">{L(active.titleDe, active.titleVi)}</h3>
          <p className="map-spot-text">{L(active.deepDe, active.deepVi)}</p>
          <button type="button" className="map-spot-close" onClick={() => setOpen(null)}>{L('Weiter', 'Tiếp tục')}</button>
        </div>
      </div>, document.body)}
  </>
}
