import {Box} from '@chakra-ui/react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import {LearningProvider} from './contexts/LearningContext'
import {SettingsProvider} from './contexts/SettingsContext'
import NewTopicPage from './pages/NewTopicPage'
import TopicPage from './pages/TopicPage'
import SubtopicPage from './pages/SubtopicPage'
import Layout from './components/Layout'

function App() {
  return (
    <SettingsProvider>
      <LearningProvider>
        <Router>
          <Box className="app-container">
            <Layout>
              <Routes>
                <Route path="/" element={<NewTopicPage/>}/>
                <Route path="/topics/:topicId" element={<TopicPage/>}/>
                <Route path="/topics/:topicId/subtopics/:subtopicId" element={<SubtopicPage/>}/>
              </Routes>
            </Layout>
          </Box>
        </Router>
      </LearningProvider>
    </SettingsProvider>
  )
}

export default App
