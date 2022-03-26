import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { ME } from "../queries"

const Recommendations = ({show}) => {
  const result = useQuery(ME)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    if (result.data) {
       setUser(result.data.me)
    }
  }, [result.data])

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{user.favoriteGenre}</strong>
    </div>
  )
}

export default Recommendations