import {redirect} from "next/navigation";

interface HomeProps {
  params: {
    lng: string
  }
}

export default function Home({params: {lng}}: HomeProps) {
  redirect(`/${lng}/account/login`);
}