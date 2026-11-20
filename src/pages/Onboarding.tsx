import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Vestibu from '../components/Vestibu'
import LanguagePicker from '../components/LanguagePicker'
import { L } from '../lib/i18n'
import { loadProfile, saveProfile } from '../lib/profile'

export default function Onboarding() {
  const [step,setStep]=useState(0)
  const navigate=useNavigate()
  const titles=[L('Eine Postkarte. Eine gemeinsame Reise.','Một tấm thiệp. Một hành trình cùng nhau.'),L('Dein Tag in drei kleinen Minuten','Một ngày với ba phút nhỏ'),L('In Ruhe und mit sicherem Halt','Thong thả và có chỗ vịn chắc chắn')]
  const next=()=>{
    if(step<2){setStep(step+1);return}
    saveProfile({gameOnboarded:true,onboarded:true})
    navigate(loadProfile()?.checks?.start||loadProfile()?.checkPostponed?'/':'/check/start',{replace:true})
  }
  return <div className="game-onboarding">
    <LanguagePicker/>
    <header className="flex items-center gap-3 mt-4"><button className="p-2" disabled={step===0} aria-label={L('Zurück','Quay lại')} onClick={()=>setStep(step-1)}><ArrowLeft/></button><p className="flow-note">{L(`Einführung ${step+1}/3`,`Giới thiệu ${step+1}/3`)}</p></header>
    <main className="flex flex-1 flex-col justify-center gap-6 py-6">
      <Vestibu mood="wave" className="mx-auto w-28"/><h1 className="text-2xl font-black">{titles[step]}</h1>
      {step===0 && <><p>{L('Vestibu findet eine leere Postkarte im Hafen. Wer hat sie geschickt? Gemeinsam folgen wir den Spuren durch den Wald bis zum Leuchtturm.','Vestibu tìm thấy một tấm thiệp trắng ở bến cảng. Ai đã gửi nó? Mình cùng lần theo manh mối qua rừng tới hải đăng nhé.')}</p><p className="flow-note">{L('90 Programmtage, neun Kapitel. Du bestimmst dein Tempo. Eine Pause löscht keine Entdeckung.','90 ngày chương trình, chín chương truyện. Bạn chọn nhịp của mình. Nghỉ một ngày không làm mất khám phá.')}</p></>}
      {step===1 && <ol className="list-decimal pl-5 space-y-4"><li>{L('Öffne „Heute“ und starte deine nächste 60-Sekunden-Minute.','Mở “Hôm nay”, bắt đầu phút tập 60 giây tiếp theo.')}</li><li>{L('Nach der ersten Minute öffnet sich die heutige Geschichte. Zwei weitere Minuten kannst du später am Tag machen.','Phút đầu mở diễn biến truyện hôm nay. Hai phút còn lại có thể tập sau trong ngày.')}</li><li>{L('Der nächste Programmtag öffnet am nächsten Kalendertag. Bonus ist freiwillig und öffnet nichts zusätzlich.','Ngày chương trình tiếp theo mở vào ngày lịch mới. Bonus tùy chọn, không mở thêm ngày.')}</li></ol>}
      {step===2 && <><p>{L('Bereite einen stabilen Stuhl und freien Platz vor. Übe nur so weit, wie es angenehm bleibt. Bei Schwindel oder Unwohlsein pausieren und hinsetzen.','Chuẩn bị ghế chắc chắn và chỗ trống. Chỉ tập trong mức dễ chịu. Khi chóng mặt hoặc khó chịu, dừng và ngồi xuống.')}</p><p>{L('Zuerst kannst du deinen Ausgangspunkt mit einem Selbsttest festhalten. Plane dafür etwa 30 ruhige Minuten ein; du kannst ihn speichern und später fortsetzen.','Trước tiên bạn có thể ghi lại điểm khởi đầu bằng bài tự kiểm tra. Dành khoảng 30 phút yên tĩnh; có thể lưu và tiếp tục sau.')}</p><p className="flow-note">{L('Sprache, Erinnerungen und Widget-Hilfe findest du später im Profil.','Ngôn ngữ, nhắc nhở và hướng dẫn widget nằm trong Hồ sơ.')}</p></>}
    </main><footer className="game-footer"><button className="game-primary w-full" onClick={next}>{step===2?(loadProfile()?.checks?.start||loadProfile()?.checkPostponed?L('Zur heutigen Minute','Về phút tập hôm nay'):L('Zum Selbsttest','Đến bài tự kiểm tra')):L('Weiter','Tiếp tục')}</button>{loadProfile()?.gameOnboarded&&<Link to="/profile" className="flow-back justify-center w-full">{L('Zurück zum Profil','Về hồ sơ')}</Link>}</footer>
  </div>
}
