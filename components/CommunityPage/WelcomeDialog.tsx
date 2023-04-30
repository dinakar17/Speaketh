import React from "react";
import { Fragment} from "react";
import { Dialog, Transition } from "@headlessui/react";

interface WelcomeDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const WelcomeDialog = ({ isOpen, setIsOpen }: WelcomeDialogProps) => {
  

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                 👋 Welcome to the community chat!
                </Dialog.Title>
                <div className="mt-2">
                  {/* Render the below three points as list */}
                  <div className="list-disc space-y-2 text-sm text-gray-500">
                    <li>
                      Here you can share things that helped you learn english better
                      like books, movies, songs, blogs, etc.
                    </li>
                    <li>
                      Please note that chat will be deleted every 24 hours to
                      keep things fresh and learn new things everyday.
                    </li>
                    <li>
                      At the same time, you can only post max 5 messages per day.
                      This is to keep the chat clean and not spammy.
                    </li>   
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WelcomeDialog;
