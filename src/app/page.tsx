import { Button } from "./components/ui/Button"
import { Input } from "./components/ui/Input"


const page = () => {
  return (
    <div className="flex flex-row items-center justify-center min-h-screen gap-4">
      <Button variant="secondary">
        Secondary  Button
      </Button>

            <Button variant="primary">
        Primary  Button
      </Button>

      <Input />
    </div>
  )
}

export default page