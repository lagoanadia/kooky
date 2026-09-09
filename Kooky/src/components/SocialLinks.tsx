import { FaGithub, FaLinkedin } from 'react-icons/fa'

function SocialLinks() {
  return (
    <div className="social-links">
      <a href="https://github.com/lagoanadia" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
      <a href="https://www.linkedin.com/in/nadia-lagoa-vilela-a36a7b380/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>
    </div>
  )
}

export default SocialLinks