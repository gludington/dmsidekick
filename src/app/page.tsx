import React from "react";
import Link from "next/link";

const features: { name: string; icon: any; description: string }[] = [];

export default function Page() {
  return (
    <div className="relative bg-white py-2 sm:py-1 lg:py-4">
      <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          About DM Sidekick
        </p>
        <p className="mx-auto mt-5 max-w-prose text-left text-base text-gray-500">
          DM Sidekick aims to bring interesting tools to Dungeons and Dragons
          players while giving me the opportunity to play with fun technology.
          The first effort,{" "}
          <Link className="u text-blue-600" href="/monsters">
            Monster Helper
          </Link>
          , is the most fun way to build a custom monster, allowing you to
          create a stat block by conversing with an AI.
        </p>
        <p className="mx-auto mt-5 max-w-prose text-left text-base text-gray-500">
          Monster Creator is currently invite-only, both while we work some
          kinks out and to keep AI costs under control. If you would like an
          invite,{" "}
          <a className="u text-blue-600" href="mailto:admin@dmsidekick.com">
            Contact us.
          </a>
        </p>
        <p className="mx-auto mt-5 max-w-prose text-left text-base text-gray-500">
          At some point, this will likely have an issue tracker, but, at the
          moment, if you are here, you have been explicitly invited, and can
          talk to me about bugs you find. Most typically, they result from
          OpenAI reaching limits.
        </p>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-xl bg-indigo-500 p-3 shadow-lg">
                        <feature.icon
                          className="h-8 w-8 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
