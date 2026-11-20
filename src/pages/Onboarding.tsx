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
  const titles=[L('Eine Postkarte. Eine gemeinsame Reise.','Một tấm thiệp. Một hành trình cùng nhau.'),L('Dreimal am Tag, je 60 Sekunden','Mỗi ngày 3 lần, mỗi lần 60 giây'),L('In Ruhe und mit sicherem Halt','Thong thả và có chỗ vịn chắc chắn')]
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
      {step===1 && <ol className="list-decimal pl-5 space-y-4"><li>{L('Tippe auf der Karte auf den heutigen Tag.','Chạm vào ngày hôm nay trên map.')}</li><li>{L('Das erste Mal öffnet die Geschichte des Tages.','Lần tập đầu mở diễn biến truyện của ngày.')}</li><li>{L('Am nächsten Tag öffnet sich der nächste Schritt.','Sang ngày mới, chặng tiếp theo sẽ mở.')}</li></ol>}
      {step===2 && <><p>{L('Bereite einen stabilen Stuhl und freien Platz vor. Übe nur so weit, wie es angenehm bleibt. Bei Schwindel oder Unwohlsein pausieren und hinsetzen.','Chuẩn bị ghế chắc chắn và chỗ trống. Chỉ tập trong mức dễ chịu. Khi chóng mặt hoặc khó chịu, dừng và ngồi xuống.')}</p><p>{L('Zuerst hältst du mit einem kurzen Selbsttest deinen Startpunkt fest. Du kannst ihn speichern und später fortsetzen.','Trước tiên, làm bài tự kiểm tra để ghi lại điểm khởi đầu. Có thể lưu và làm tiếp sau.')}</p></>}
    </main><footer className="game-footer"><button className="game-primary w-full" onClick={next}>{step===2?(loadProfile()?.checks?.start||loadProfile()?.checkPostponed?L('Los geht’s','Bắt đầu'):L('Zum Selbsttest','Đến bài tự kiểm tra')):L('Weiter','Tiếp tục')}</button></footer>
  </div>
}
