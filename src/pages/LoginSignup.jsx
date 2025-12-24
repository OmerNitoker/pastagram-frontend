import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import { login, signup } from '../store/actions/user.actions'
import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/img/logo-png.png'
import loginImg from '../assets/img/login-img-frame.png'

export function LoginSignup() {
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
    const [isSignup, setIsSignup] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const logoutUser = async () => {
            const user = userService.getLoggedinUser()
            if (user) await userService.logout()
        }
        logoutUser()
    }, [])

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
        setIsSignup(false)
    }


    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password) return
        try {
            const user = await login(credentials)
            navigate('/')
        } catch (err) {
            console.log('Failed to login', err)
            throw err
        }
        finally {
            clearState()
        }
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        try {
            await signup(credentials)
            navigate('/')
        } catch (err) {
            console.log('Cannot signup', err)
            throw err
        }
        finally {
            clearState()
        }
    }

    function toggleSignup() {
        setIsSignup(!isSignup)
    }

    async function loginGuest(ev) {
        try {
            ev.preventDefault()
            const creds = {
                username: 'guy_yaakov',
                password: 'guy123',
                fullname: 'Guy Yaakov'
            }
            await login(creds)
            navigate('/')
        } catch (err) {
            console.log('Failed to login as guest:', err)
            throw err
        }
        finally {
            clearState()
        }
    }

    // function onUploaded(imgUrl) {
    //     setCredentials({ ...credentials, imgUrl })
    // }

    return (
        <div className="login-page">
            {/* <img className="loginsignup-image" src="https://res.cloudinary.com/dmhaze3tc/image/upload/v1714984151/insta-project/login-image_veqqrw.png" alt="mockup" /> */}
            <img className="loginsignup-image" src={loginImg} alt="mockup" />
            {!isSignup && <form className="login-form" onSubmit={onLogin}>
                <div className="pasta-logo">
                    <img src={logoImg} alt="" />
                </div>
                <input
                    type="mail"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button className='login-submit-btn'>Login!</button>
                <p>Don't have an account? <span className='login-signup-btn' onClick={toggleSignup}>Sign up</span></p>
                <p>or</p>
                <button className="login-demo-btn fw600" onClick={loginGuest}> Continue as guest</button>

            </form>}
            <div className="signup-section">
                {isSignup && <form className="signup-form" onSubmit={onSignup}>
                    {/* <h1 className="logo">Vistagram</h1> */}
                    <div className="pasta-logo">
                        <img src={logoImg} alt="" />
                    </div>
                    <input
                        type="mail"
                        name="fullname"
                        value={credentials.fullname}
                        placeholder="Fullname"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="mail"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    {/* <ImgUploader onUploaded={onUploaded} /> */}
                    <button className='signup-submit-btn'>Signup!</button>
                    <p>Have an account? <span className='login-signup-btn' onClick={toggleSignup}>Log in</span></p>
                    <button className="login-demo-btn fw600" onClick={loginGuest}> Continue as guest</button>
                </form>}
            </div>
        </div>
    )
}
