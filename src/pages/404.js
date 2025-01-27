import React, { Component } from "react";
import { useRouter } from "next/router";
import Main from "@/layout/Main";
import Head from "next/head";

export default function Error404() {
  const router = useRouter();

  console.log(router.query);

  return (
    <>
      <Head>
        <title>404 Something Went Wrong</title>
      </Head>
      <div
        className={`w-full flex items-center justify-center mt-24 mb-16 sm:flex-row overflow-hidden`}
      >
        <div className="w-[900px] ml-36">
          <p className="Orange_Text font-montserrat font-bold text-3xl mb-6">
            PAGE NOT FOUND
          </p>

          <p className="Orange_Text font-montserrat font-bold text-base mb-6 w-[700px]">
            Looks like youve found yourself in the wrong place. Enjoy this meme
            or if you want to keep shopping the best deals in the UAE click{" "}
            <a
              className="text-red-500 font-bold cursor-pointer"
              onClick={() => router.replace("/")}
            >
              here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

Error404.layout = Main;
