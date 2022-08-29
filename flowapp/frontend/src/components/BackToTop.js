import React, {useEffect, useState} from 'react'
import { Container } from 'react-bootstrap'
import { Button } from 'antd'

const BackToTop = () => {

    const [backToTopButton, setBackToTopButton] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if(window.scrollY > 100) {
                setBackToTopButton(true)
            } else {
                setBackToTopButton(false)
            }
        })
    }, [])

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

  return (
    <Container>
        {backToTopButton && (
            <Button type="primary" shape="round" size='large' onClick={scrollUp} style={{position: 'fixed', bottom: '50px', right:'50px' }}><i className="bi bi-arrow-up-circle"></i></Button>
        )}
    </Container>
  )
}

export default BackToTop