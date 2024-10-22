import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Sign } from "crypto";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title:
    "Crewlink Deshboard" 

};

export default function Home() {
  return (
    <>
    <SignIn/>
    </>
  );
}
