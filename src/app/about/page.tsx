/**
 * v0 by Vercel.
 * @see https://v0.dev/t/RCOpF6HFtjZ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <PowerIcon className="h-6 w-6" />
          <span className="sr-only">Olea Hydraulic</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Hydraulic Solutions for Industry
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Olea Hydraulic specializes in providing high-quality
                    hydraulic solutions for industrial applications. Our team of
                    experts delivers customized products and services to meet
                    your unique needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Our Products
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Innovative Hydraulic Solutions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Olea Hydraulic offers a wide range of high-performance
                  hydraulic products, including pumps, valves, cylinders, and
                  custom engineered solutions to meet your specific
                  requirements.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/placeholder.svg"
                width="550"
                height="310"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Hydraulic Pumps</h3>
                      <p className="text-muted-foreground">
                        Our high-quality hydraulic pumps are designed for
                        reliability and efficiency in a wide range of industrial
                        applications.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Hydraulic Valves</h3>
                      <p className="text-muted-foreground">
                        Our hydraulic valves provide precise control and
                        regulation of fluid flow, pressure, and direction.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Hydraulic Cylinders</h3>
                      <p className="text-muted-foreground">
                        Our hydraulic cylinders offer exceptional power and
                        reliability for a variety of industrial applications.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Trusted by Industry Leaders
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Olea Hydraulic has a proven track record of delivering
                high-quality hydraulic solutions to a wide range of industries.
                Our clients trust us to provide reliable and innovative products
                that meet their unique needs.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  width="140"
                  height="70"
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  width="140"
                  height="70"
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  width="140"
                  height="70"
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  width="140"
                  height="70"
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What Our Clients Say
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our satisfied customers about their experience working
                with Olea Hydraulic.
              </p>
            </div>
            <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">
                        Manufacturing Manager
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Olea Hydraulic has been a reliable partner for our\n
                    manufacturing operations. Their products are top-notch\n and
                    their customer service is exceptional."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Sarah Anderson</h4>
                      <p className="text-sm text-muted-foreground">
                        Maintenance Supervisor
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "We've been using Olea Hydraulic's products for years, and\n
                    they've consistently delivered reliable and
                    high-performing\n solutions for our maintenance needs."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Michael Roberts</h4>
                      <p className="text-sm text-muted-foreground">
                        Plant Manager
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Olea Hydraulic's technical expertise and commitment to\n
                    customer satisfaction have been invaluable to our\n
                    operations. We highly recommend their services."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Contact Us
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Let's Discuss Your Hydraulic Needs
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Our team of experts is ready to assist you with customized
                  hydraulic solutions for your industry. Contact us today to
                  learn more about our products and services.
                </p>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Get in Touch
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Location
                </div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Olea Hydraulic's headquarters is located in the heart of the
                  industrial district, providing easy access to our clients and
                  partners.
                </p>
                <div className="rounded-lg overflow-hidden w-full aspect-video">
                  <img
                    src="/placeholder.svg"
                    width="600"
                    height="400"
                    alt="Location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <Link href="#" prefetch={false}>
              About Us
            </Link>
            <Link href="#" prefetch={false}>
              Our Team
            </Link>
            <Link href="#" prefetch={false}>
              Careers
            </Link>
            <Link href="#" prefetch={false}>
              News
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Products</h3>
            <Link href="#" prefetch={false}>
              Hydraulic Pumps
            </Link>
            <Link href="#" prefetch={false}>
              Hydraulic Valves
            </Link>
            <Link href="#" prefetch={false}>
              Hydraulic Cylinders
            </Link>
            <Link href="#" prefetch={false}>
              Custom Solutions
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibol" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function PowerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
  );
}
