import HomePage from "./pages/Home"
import ReactQueryProvider from "./providers/ReactQueryProvider"

function App() {
  return (
    <ReactQueryProvider>
       <HomePage />
    </ReactQueryProvider>
  )
}

export default App
