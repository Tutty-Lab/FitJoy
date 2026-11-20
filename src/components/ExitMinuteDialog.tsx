import { useEffect, useRef } from 'react'
import { L } from '../lib/i18n'

export default function ExitMinuteDialog({stay,leave}:{stay:()=>void;leave:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[])
  return <dialog ref={ref} className="flow-exit" aria-labelledby="exit-title" onCancel={event=>{event.preventDefault();stay()}}>
    <section className="flow-card"><h2 id="exit-title">{L('Diese Minute verlassen?', 'Rời phút tập này?')}</h2><p>{L('Diese noch nicht abgeschlossene Minute wird nicht gespeichert. Frühere Minuten und Entdeckungen bleiben erhalten.', 'Phút đang tập chưa hoàn thành sẽ không được lưu. Các phút và khám phá đã hoàn thành vẫn được giữ.')}</p><button autoFocus className="game-primary" onClick={stay}>{L('Bei der Übung bleiben','Ở lại bài tập')}</button><button className="game-secondary" onClick={leave}>{L('Minute beenden und zurück','Dừng phút tập và quay lại')}</button></section>
  </dialog>
}
