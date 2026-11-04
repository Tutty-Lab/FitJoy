import { Link } from 'react-router-dom'
import icSignIn from '../../assets/auth/l-signin.svg'
import icSignUp from '../../assets/auth/l-signup.svg'
import icSignUpActive from '../../assets/auth/s-signup.svg'

export default function AuthTabs({ active }: { active: 'signin' | 'signup' }) {
  const on = 'bg-white shadow-md'
  return (
    <div className="flex w-full items-center rounded-full bg-[#e7efee] p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
      <Link
        to="/login"
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm leading-[18px] font-semibold ${active === 'signin' ? `${on} text-ink` : 'text-[#3f4a4b]'}`}
      >
        {active === 'signin' && <img src={icSignIn} alt="" className="size-[13.5px]" />}
        Sign In
      </Link>
      <Link
        to="/signup"
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm leading-[18px] font-semibold ${active === 'signup' ? `${on} text-[#13707e]` : 'text-[#3f4a4b]'}`}
      >
        <img src={active === 'signup' ? icSignUpActive : icSignUp} alt="" style={active === 'signup' ? { width: 14.667, height: 10.667 } : { width: 16.5, height: 12 }} />
        Sign Up
      </Link>
    </div>
  )
}
