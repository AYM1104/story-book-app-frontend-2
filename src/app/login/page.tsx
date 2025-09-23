import BackgroundStars from '../../components/BackgroundStars'
import LoginCard from '../../components/LoginCard'

export default function Page() {
  return (
    <BackgroundStars>
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoginCard />
      </div>
    </BackgroundStars>
  )
}
    