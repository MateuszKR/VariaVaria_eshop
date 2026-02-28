import Link from 'next/link'
import Image from 'next/image'
import {
    Instagram,
    Facebook,
    MessageCircle,
} from 'lucide-react'

const links = [
    { title: 'Products', href: '/products' },
    { title: 'Categories', href: '/categories' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
]

const socialLinks = [
    { icon: Facebook,       label: 'Facebook',  href: 'https://www.facebook.com/HelenkiVariaVaria' },
    { icon: Instagram,      label: 'Instagram', href: 'https://instagram.com/variavaria_koniczynka?igsh=bW9hOGJ6bDRsMXds' },
    { icon: MessageCircle,  label: 'WhatsApp',  href: 'https://wa.me/48507754522' },
]

export default function FooterSection() {
    return (
        <footer className="py-16 md:py-24 bg-neutral-900">
            <div className="mx-auto max-w-5xl px-6">
                {/* Logo + social icons on the same row */}
                <div className="flex items-center justify-between">
                    <Link href="/" aria-label="go home">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/varia-varia-logo.jpg"
                                    alt="VariaVaria Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-serif font-semibold text-white">VariaVaria</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-6">
                        {socialLinks.map(({ icon: Icon, label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                aria-label={label}
                                className="text-neutral-400 hover:text-primary-400 block duration-150">
                                <Icon className="size-[30px]" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-[21px]">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-neutral-400 hover:text-primary-400 block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>

                <span className="text-neutral-500 block text-center text-sm">
                    © {new Date().getFullYear()} VariaVaria. All rights reserved.
                </span>
            </div>
        </footer>
    )
}
