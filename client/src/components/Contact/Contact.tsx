import { useRef } from 'react'
import { toast } from 'react-toastify'
import ReCAPTCHA from "react-google-recaptcha"
import axios from "../../api/axios.js";
import { ToastContainer } from "react-toastify";

const Contact = () => {

    const emailRef = useRef<HTMLInputElement>(null)
    const subjectRef = useRef<HTMLInputElement>(null)
    const messageRef = useRef<HTMLTextAreaElement>(null)
    const captchaRef = useRef<ReCAPTCHA>(null);

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!captchaRef.current?.getValue()) {
            toast.error("Please verify yourself :)", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            await axios.post("/contact", {
                email: emailRef.current?.value,
                subject: subjectRef.current?.value,
                message: messageRef.current?.value
            })
            toast.success("Feedback has been sent", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            if (emailRef.current) emailRef.current.value = '';
            if (subjectRef.current) subjectRef.current.value = '';
            if (messageRef.current) messageRef.current.value = '';
            if (captchaRef.current) captchaRef.current.reset();
        }
    }

    return (
        <div>
            <ToastContainer />
            <section className="bg-gray-100">
                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">Contact Us</h2>
                    <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">Got a technical issue? Want to send feedback about a feature? Let us know.</p>
                    <form onSubmit={onSubmitHandler} className="space-y-8">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                            <input ref={emailRef} type="email" id="email" className="!outline-none shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:shadow-sm" placeholder="example@gmail.com" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Subject</label>
                            <input ref={subjectRef} type="text" id="subject" className="!outline-none block p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500" placeholder="Let us know how we can help you" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                            <textarea ref={messageRef} id="message" className="!outline-none block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg shadow-sm border border-gray-300 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500" placeholder="Leave a comment..." required></textarea>
                        </div>
                        <div>
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA}
                                ref={captchaRef}
                            />
                        </div>
                        <button type="submit" className="text-white bg-purpleAccent hover:bg-softerPurple focus:ring-4 focus:outline-none focus:ring-softerPurple font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:cursor-pointer">Send message</button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Contact