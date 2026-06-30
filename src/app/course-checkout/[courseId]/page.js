"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileImage,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

import { api } from "../../lib/api";
import { useSingleCourse } from "../../hooks/useCourses";
import { useMe } from "../../hooks/useAuth";

/*
|--------------------------------------------------------------------------
| Bank Account Details
|--------------------------------------------------------------------------
*/

const BANK_DETAILS = {
  bankName:
    process.env.NEXT_PUBLIC_BANK_NAME || "",

  accountName:
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "",

  iban:
    process.env.NEXT_PUBLIC_BANK_IBAN || "",
};

const INITIAL_BANK_FORM = {
  accountHolderName: "",
  bankName: "",
  senderAccountNumber: "",
  transactionReference: "",
  transferDate: "",
  customerNote: "",
};

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

const extractCourse = (response) => {
  const possibleCourses = [
    response?.data?.course,
    response?.data,
    response?.course,
    response,
  ];

  return (
    possibleCourses.find(
      (value) =>
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (value?._id || value?.id || value?.title)
    ) || null
  );
};

const getCourseId = (course) => {
  return String(course?._id || course?.id || "");
};

const getCourseImage = (course) => {
  if (course?.thumbnail?.url) {
    return course.thumbnail.url;
  }

  if (course?.image?.url) {
    return course.image.url;
  }

  if (course?.coverImage?.url) {
    return course.coverImage.url;
  }

  if (typeof course?.thumbnail === "string") {
    return course.thumbnail;
  }

  if (typeof course?.image === "string") {
    return course.image;
  }

  if (typeof course?.coverImage === "string") {
    return course.coverImage;
  }

  return "";
};

const getCoursePrice = (course) => {
  const value =
    course?.price ??
    course?.salePrice ??
    course?.coursePrice ??
    0;

  const price = Number(value);

  if (!Number.isFinite(price)) {
    return 0;
  }

  return Math.max(0, price);
};

const formatPrice = (price) => {
  return `AED ${Number(price || 0).toFixed(2)}`;
};

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  return (
    error?.userMessage ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const wait = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

/*
|--------------------------------------------------------------------------
| Course Checkout Page
|--------------------------------------------------------------------------
*/

export default function CourseCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const ziinaIframeRef = useRef(null);

  const rawCourseId =
    params?.courseId ?? params?.id;

  const routeCourseId = Array.isArray(rawCourseId)
    ? rawCourseId[0]
    : rawCourseId;

  /*
  |--------------------------------------------------------------------------
  | Course
  |--------------------------------------------------------------------------
  */

  const {
    data: courseResponse,
    isLoading: courseLoading,
    isError: courseError,
    error: courseRequestError,
  } = useSingleCourse(routeCourseId);

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  const {
    data: user,
    isLoading: authLoading,
    isFetching: authFetching,
    isError: authError,
    error: authRequestError,
  } = useMe();

  /*
  |--------------------------------------------------------------------------
  | Payment States
  |--------------------------------------------------------------------------
  */

  const [paymentMethod, setPaymentMethod] =
    useState("ziina");

  const [paymentError, setPaymentError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Card Payment States
  |--------------------------------------------------------------------------
  */

  const [isCreatingCardPayment, setIsCreatingCardPayment] =
    useState(false);

  const [cardCheckout, setCardCheckout] =
    useState(null);

  const [cardPaymentStatus, setCardPaymentStatus] =
    useState("");

  const [isVerifyingPayment, setIsVerifyingPayment] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Bank Transfer States
  |--------------------------------------------------------------------------
  */

  const [bankForm, setBankForm] =
    useState(INITIAL_BANK_FORM);

  const [receipt, setReceipt] =
    useState(null);

  const [receiptPreview, setReceiptPreview] =
    useState("");

  const [formErrors, setFormErrors] =
    useState({});

  const [bankTransferSuccess, setBankTransferSuccess] =
    useState(null);

  const [isSubmittingBank, setIsSubmittingBank] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Derived Data
  |--------------------------------------------------------------------------
  */

  const course = useMemo(() => {
    return extractCourse(courseResponse);
  }, [courseResponse]);

  const courseId =
    getCourseId(course) ||
    String(routeCourseId || "");

  const price = getCoursePrice(course);

  const authStatus =
    authRequestError?.response?.status;

  const isCheckingAuth =
    authLoading || authFetching;

  const bankDetailsReady = Boolean(
    BANK_DETAILS.bankName &&
      BANK_DETAILS.accountName &&
      BANK_DETAILS.iban
  );

  const embeddedCheckoutUrl = useMemo(() => {
    const embeddedUrl =
      cardCheckout?.embeddedUrl;

    if (!embeddedUrl) {
      return "";
    }

    const separator = embeddedUrl.includes("?")
      ? "&"
      : "?";

    return `${embeddedUrl}${separator}version=latest`;
  }, [cardCheckout]);

  /*
  |--------------------------------------------------------------------------
  | Authentication Redirect
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      isCheckingAuth ||
      !authError ||
      authStatus !== 401
    ) {
      return;
    }

    const redirectPath =
      `/course-checkout/${routeCourseId}`;

    router.replace(
      `/login?redirect=${encodeURIComponent(
        redirectPath
      )}`
    );
  }, [
    authError,
    authStatus,
    isCheckingAuth,
    routeCourseId,
    router,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Receipt Preview Cleanup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (receiptPreview.startsWith("blob:")) {
        URL.revokeObjectURL(receiptPreview);
      }
    };
  }, [receiptPreview]);

  /*
  |--------------------------------------------------------------------------
  | Verify Card Payment From Our Backend
  |--------------------------------------------------------------------------
  */

  const verifyCardPayment = useCallback(
    async (purchaseId) => {
      if (!purchaseId) {
        return false;
      }

      try {
        const response = await api.get(
          `/payment/ziina/status/${purchaseId}`
        );

        const result =
          response?.data?.data ||
          response?.data ||
          {};

        const paymentStatus = String(
          result?.paymentStatus ||
            result?.status ||
            ""
        ).toLowerCase();

        const hasCourseAccess =
          result?.hasCourseAccess === true ||
          result?.enrollment?.status === "active";

        if (
          hasCourseAccess ||
          paymentStatus === "paid" ||
          paymentStatus === "completed"
        ) {
          setCardPaymentStatus("completed");

          router.replace(
            `/courses/learning/${courseId}`
          );

          return true;
        }

        if (
          paymentStatus === "failed" ||
          paymentStatus === "rejected"
        ) {
          setCardPaymentStatus("failed");

          setPaymentError(
            result?.message ||
              "Your card payment failed. Please try again."
          );

          return false;
        }

        if (
          paymentStatus === "cancelled" ||
          paymentStatus === "canceled"
        ) {
          setCardPaymentStatus("canceled");

          setPaymentError(
            "The card payment was canceled."
          );

          return false;
        }

        setCardPaymentStatus(
          paymentStatus || "processing"
        );

        return false;
      } catch (error) {
        const status =
          error?.response?.status;

        if (status === 401) {
          router.replace(
            `/login?redirect=${encodeURIComponent(
              `/course-checkout/${courseId}`
            )}`
          );

          return false;
        }

        return false;
      }
    },
    [courseId, router]
  );

  /*
  |--------------------------------------------------------------------------
  | Wait Until Webhook / Backend Marks Purchase Paid
  |--------------------------------------------------------------------------
  */

  const waitForPaymentConfirmation =
    useCallback(
      async (purchaseId) => {
        setIsVerifyingPayment(true);
        setPaymentError("");

        try {
          /*
           * Payment may take a few seconds to be confirmed
           * by webhook/backend.
           */
          for (
            let attempt = 1;
            attempt <= 12;
            attempt += 1
          ) {
            const confirmed =
              await verifyCardPayment(
                purchaseId
              );

            if (confirmed) {
              return;
            }

            await wait(1500);
          }

          setCardPaymentStatus("processing");

          setPaymentError(
            "Your payment is being confirmed. Click verify payment after a few seconds."
          );
        } finally {
          setIsVerifyingPayment(false);
        }
      },
      [verifyCardPayment]
    );

  /*
  |--------------------------------------------------------------------------
  | Ziina Iframe Payment Events
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!cardCheckout?.embeddedUrl) {
      return undefined;
    }

    const handleZiinaMessage = async (
      event
    ) => {
      const iframe =
        ziinaIframeRef.current;

      if (!iframe) {
        return;
      }

      /*
       * Only accept messages from our Ziina iframe.
       */
      if (
        event.source !==
        iframe.contentWindow
      ) {
        return;
      }

      /*
       * Ziina official embedded checkout origin.
       */
      if (
        event.origin !==
        "https://pay.ziina.com"
      ) {
        return;
      }

      const eventType =
        event?.data?.type;

      const status = String(
        event?.data?.data?.status || ""
      ).toUpperCase();

      if (
        eventType !==
        "PAYMENT_STATUS_CHANGE"
      ) {
        return;
      }

      if (status === "COMPLETED") {
        setCardPaymentStatus("completed");

        await waitForPaymentConfirmation(
          cardCheckout.purchaseId
        );

        return;
      }

      if (status === "FAILED") {
        setCardPaymentStatus("failed");

        setPaymentError(
          "Your card payment failed. Please check your card information and try again."
        );

        return;
      }

      if (
        status === "CANCELED" ||
        status === "CANCELLED"
      ) {
        setCardPaymentStatus("canceled");

        setPaymentError(
          "The card payment was canceled."
        );
      }
    };

    window.addEventListener(
      "message",
      handleZiinaMessage
    );

    return () => {
      window.removeEventListener(
        "message",
        handleZiinaMessage
      );
    };
  }, [
    cardCheckout,
    waitForPaymentConfirmation,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Create Ziina Embedded Card Checkout
  |--------------------------------------------------------------------------
  */

  const handleCardPayment = async () => {
    if (
      !courseId ||
      !user ||
      isCreatingCardPayment
    ) {
      return;
    }

    setPaymentError("");
    setCardPaymentStatus("");
    setIsCreatingCardPayment(true);

    try {
      const response = await api.post(
        `/payment/ziina/create/${courseId}`
      );

      const result =
        response?.data?.data ||
        response?.data ||
        {};

      const embeddedUrl =
        result?.embeddedUrl ||
        result?.embedded_url ||
        result?.paymentIntent?.embedded_url;

      const purchaseId =
        result?.purchaseId ||
        result?.coursePurchaseId ||
        result?.purchase?._id;

      const providerPaymentId =
        result?.providerPaymentId ||
        result?.paymentIntentId ||
        result?.paymentIntent?.id;

      if (!embeddedUrl) {
        throw new Error(
          "Embedded card checkout URL was not returned by the server."
        );
      }

      if (!purchaseId) {
        throw new Error(
          "Course purchase ID was not returned by the server."
        );
      }

      setCardCheckout({
        embeddedUrl,
        purchaseId,
        providerPaymentId:
          providerPaymentId || "",
      });

      setCardPaymentStatus(
        "requires_payment_instrument"
      );
    } catch (error) {
      const status =
        error?.response?.status;

      if (status === 401) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/course-checkout/${courseId}`
          )}`
        );

        return;
      }

      if (
        status === 409 &&
        error?.response?.data?.data
          ?.hasCourseAccess
      ) {
        router.replace(
          `/courses/learning/${courseId}`
        );

        return;
      }

      setPaymentError(
        getErrorMessage(
          error,
          "Unable to open the secure card checkout."
        )
      );
    } finally {
      setIsCreatingCardPayment(false);
    }
  };

  const resetCardCheckout = () => {
    setCardCheckout(null);
    setCardPaymentStatus("");
    setPaymentError("");
    setIsVerifyingPayment(false);
  };

  const handleManualPaymentVerification =
    async () => {
      if (
        !cardCheckout?.purchaseId ||
        isVerifyingPayment
      ) {
        return;
      }

      await waitForPaymentConfirmation(
        cardCheckout.purchaseId
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Bank Transfer Functions
  |--------------------------------------------------------------------------
  */

  const handleBankChange = (event) => {
    const { name, value } =
      event.target;

    setBankForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setPaymentError("");
  };

  const handleReceiptChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setFormErrors((current) => ({
        ...current,
        receipt:
          "Upload a JPG, PNG, or WEBP image.",
      }));

      event.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setFormErrors((current) => ({
        ...current,
        receipt:
          "The receipt must be smaller than 5 MB.",
      }));

      event.target.value = "";

      return;
    }

    if (
      receiptPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        receiptPreview
      );
    }

    setReceipt(file);

    setReceiptPreview(
      URL.createObjectURL(file)
    );

    setFormErrors((current) => ({
      ...current,
      receipt: "",
    }));

    setPaymentError("");
  };

  const removeReceipt = () => {
    if (
      receiptPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        receiptPreview
      );
    }

    setReceipt(null);
    setReceiptPreview("");
  };

  const validateBankForm = () => {
    const errors = {};

    if (
      bankForm.accountHolderName
        .trim().length < 3
    ) {
      errors.accountHolderName =
        "Enter the account holder name.";
    }

    if (
      bankForm.bankName
        .trim().length < 2
    ) {
      errors.bankName =
        "Enter the sender bank name.";
    }

    if (
      bankForm.senderAccountNumber
        .trim().length < 4
    ) {
      errors.senderAccountNumber =
        "Enter the account number or IBAN.";
    }

    if (
      bankForm.transactionReference
        .trim().length < 3
    ) {
      errors.transactionReference =
        "Enter the transaction reference.";
    }

    if (!bankForm.transferDate) {
      errors.transferDate =
        "Select the transfer date.";
    }

    if (!receipt) {
      errors.receipt =
        "Upload the payment receipt.";
    }

    return errors;
  };

  const handleBankTransferSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !courseId ||
        !user ||
        isSubmittingBank
      ) {
        return;
      }

      setPaymentError("");
      setBankTransferSuccess(null);

      if (!bankDetailsReady) {
        setPaymentError(
          "Bank account details have not been configured."
        );

        return;
      }

      const errors =
        validateBankForm();

      if (
        Object.keys(errors).length > 0
      ) {
        setFormErrors(errors);

        return;
      }

      setIsSubmittingBank(true);

      try {
        const requestData =
          new FormData();

        requestData.append(
          "image",
          receipt
        );

        requestData.append(
          "accountHolderName",
          bankForm.accountHolderName.trim()
        );

        requestData.append(
          "bankName",
          bankForm.bankName.trim()
        );

        requestData.append(
          "senderAccountNumber",
          bankForm.senderAccountNumber.trim()
        );

        requestData.append(
          "transactionReference",
          bankForm.transactionReference.trim()
        );

        requestData.append(
          "transferAmount",
          String(price)
        );

        requestData.append(
          "transferDate",
          new Date(
            bankForm.transferDate
          ).toISOString()
        );

        requestData.append(
          "customerNote",
          bankForm.customerNote.trim()
        );

        const response = await api.post(
          `/payment/bank-transfer/course/${courseId}`,
          requestData
        );

        setBankTransferSuccess(
          response?.data?.data || {
            paymentStatus: "pending",
          }
        );

        setBankForm(
          INITIAL_BANK_FORM
        );

        removeReceipt();
      } catch (error) {
        const status =
          error?.response?.status;

        if (status === 401) {
          router.replace(
            `/login?redirect=${encodeURIComponent(
              `/course-checkout/${courseId}`
            )}`
          );

          return;
        }

        if (
          status === 409 &&
          error?.response?.data?.data
            ?.hasCourseAccess
        ) {
          router.replace(
            `/courses/learning/${courseId}`
          );

          return;
        }

        setPaymentError(
          getErrorMessage(
            error,
            "Unable to submit the bank transfer."
          )
        );
      } finally {
        setIsSubmittingBank(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Loading / Error States
  |--------------------------------------------------------------------------
  */

  if (
    courseLoading ||
    isCheckingAuth ||
    authStatus === 401
  ) {
    return <CheckoutLoading />;
  }

  if (
    authError &&
    authStatus !== 401
  ) {
    return (
      <CheckoutError
        message={getErrorMessage(
          authRequestError,
          "Authentication could not be verified."
        )}
      />
    );
  }

  if (courseError || !course) {
    return (
      <CheckoutError
        message={getErrorMessage(
          courseRequestError,
          "Course could not be loaded."
        )}
      />
    );
  }

  const image =
    getCourseImage(course);

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-5 py-24 text-[#211e1a]">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#776d62] transition hover:text-[#a98745]"
        >
          <ArrowLeft size={15} />
          Back to Course
        </Link>

        <div className="mt-7 grid overflow-hidden rounded-[14px] border border-[#e4d9cd] bg-white shadow-[0_20px_60px_rgba(45,35,24,0.08)] lg:grid-cols-[1fr_0.9fr]">
          <section className="border-b border-[#eee6dd] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
              Course Checkout
            </p>

            <div className="mt-6 overflow-hidden rounded-[10px] bg-[#e9dfd3]">
              {image ? (
                <img
                  src={image}
                  alt={course.title}
                  className="aspect-[16/10] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center">
                  <BookOpen
                    size={50}
                    className="text-[#a98745]"
                  />
                </div>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              {course.title}
            </h1>

            <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#6d645b]">
              {course.description ||
                "Creative course with guided lessons."}
            </p>

            <div className="mt-7 flex items-start gap-3 rounded-[20px] border border-[#e9dfd4] bg-[#faf8f5] p-5">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-[#a98745]"
              />

              <div>
                <p className="text-sm font-semibold">
                  Secure payment with Ziina
                </p>

                <p className="mt-1 text-xs leading-6 text-[#746b62]">
                  Your payment is completed through Ziina’s secure checkout. Card details are never stored by this website.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-[#e9dfd4] bg-white p-5">
              <LockKeyhole
                size={20}
                className="mt-0.5 shrink-0 text-[#a98745]"
              />

              <div>
                <p className="text-sm font-semibold">
                  Protected course access
                </p>

                <p className="mt-1 text-xs leading-6 text-[#746b62]">
                  Course access is activated
                  only after successful
                  payment confirmation.
                </p>
              </div>
            </div>
          </section>

          <aside className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 rounded-[20px] border border-[#e8ded3] bg-[#faf8f5] p-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#8c8176]">
                    Course
                  </p>

                  <p className="mt-2 font-semibold leading-6">
                    {course.title}
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
                  {formatPrice(price)}
                </p>
              </div>

              <div className="my-5 border-t border-[#e4dacf]" />

              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  Total
                </p>

                <p className="text-xl font-bold">
                  {formatPrice(price)}
                </p>
              </div>
            </div>

            {!cardCheckout && (
              <>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#776d62]">
                  Select Payment Method
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <PaymentMethodButton
                    active={
                      paymentMethod ===
                      "ziina"
                    }
                    icon={
                      <ZiinaMark compact />
                    }
                    title="Pay with Ziina"
                    description="Cards, Apple Pay & Google Pay"
                    onClick={() => {
                      setPaymentMethod(
                        "ziina"
                      );

                      setPaymentError("");
                    }}
                  />

                  <PaymentMethodButton
                    active={
                      paymentMethod ===
                      "bank_transfer"
                    }
                    icon={
                      <Landmark
                        size={20}
                      />
                    }
                    title="Bank Transfer"
                    description="Manual approval"
                    onClick={() => {
                      setPaymentMethod(
                        "bank_transfer"
                      );

                      setPaymentError("");
                    }}
                  />
                </div>
              </>
            )}

            {paymentError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                {paymentError}
              </div>
            )}

            {paymentMethod === "ziina" && (
              <CardPaymentSection
                price={price}
                cardCheckout={
                  cardCheckout
                }
                embeddedCheckoutUrl={
                  embeddedCheckoutUrl
                }
                iframeRef={
                  ziinaIframeRef
                }
                cardPaymentStatus={
                  cardPaymentStatus
                }
                isCreating={
                  isCreatingCardPayment
                }
                isVerifying={
                  isVerifyingPayment
                }
                onStart={
                  handleCardPayment
                }
                onVerify={
                  handleManualPaymentVerification
                }
                onCancel={
                  resetCardCheckout
                }
              />
            )}

            {paymentMethod ===
              "bank_transfer" &&
              !cardCheckout && (
                <BankTransferForm
                  bankForm={bankForm}
                  bankDetails={
                    BANK_DETAILS
                  }
                  bankDetailsReady={
                    bankDetailsReady
                  }
                  price={price}
                  receipt={receipt}
                  receiptPreview={
                    receiptPreview
                  }
                  formErrors={formErrors}
                  isSubmitting={
                    isSubmittingBank
                  }
                  success={
                    bankTransferSuccess
                  }
                  onChange={
                    handleBankChange
                  }
                  onReceiptChange={
                    handleReceiptChange
                  }
                  onRemoveReceipt={
                    removeReceipt
                  }
                  onSubmit={
                    handleBankTransferSubmit
                  }
                />
              )}
          </aside>
        </div>
      </div>
    </main>
  );
}


function ZiinaMark({ compact = false, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2 ${light ? "text-white" : "text-[#6d2cff]"}`} aria-label="Ziina">
      <span className={`grid place-items-center font-black ${compact ? "h-6 w-6 text-sm" : "h-8 w-8 text-base"} rounded-[7px] ${light ? "bg-white text-[#6d2cff]" : "bg-[#6d2cff] text-white"}`}>Z</span>
      {!compact && <span className="font-extrabold tracking-[-0.03em]">Ziina</span>}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Card Payment Section
|--------------------------------------------------------------------------
*/

function CardPaymentSection({
  price,
  cardCheckout,
  embeddedCheckoutUrl,
  iframeRef,
  cardPaymentStatus,
  isCreating,
  isVerifying,
  onStart,
  onVerify,
  onCancel,
}) {
  if (!cardCheckout) {
    return (
      <>
        <button
          type="button"
          onClick={onStart}
          disabled={
            isCreating || price < 2
          }
          className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#6d2cff] px-6 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#5620d4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              Opening Ziina
            </>
          ) : (
            <>
              <ZiinaMark compact light />
              Pay with Ziina · {formatPrice(price)}
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] leading-5 text-[#8c8176]">
          <ShieldCheck size={14} />
          Securely processed by Ziina
        </div>

        {price < 2 && (
          <p className="mt-3 text-center text-xs text-red-600">
            The minimum card payment is AED
            2.00.
          </p>
        )}
      </>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">
            Ziina Secure Checkout
          </p>

          <p className="mt-1 text-[11px] text-[#8c8176]">
            Complete your payment in the protected Ziina checkout below.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isVerifying}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ddd3c7] text-[#776d62] transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
          aria-label="Close card checkout"
        >
          <X size={16} />
        </button>
      </div>

      {cardPaymentStatus ===
        "completed" ||
      isVerifying ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <div className="flex items-center gap-3">
            {isVerifying ? (
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            ) : (
              <CheckCircle2 size={20} />
            )}

            <div>
              <p className="text-sm font-semibold">
                {isVerifying
                  ? "Confirming payment"
                  : "Payment completed"}
              </p>

              <p className="mt-1 text-[11px]">
                Please do not close this page.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[20px] border border-[#e4d9cd] bg-white">
        <iframe
          ref={iframeRef}
          id="ziina-checkout"
          title="Ziina secure checkout"
          src={embeddedCheckoutUrl}
          allow="payment"
          frameBorder="0"
          className="h-[820px] w-full bg-white"
        />
      </div>

      <button
        type="button"
        onClick={onVerify}
        disabled={isVerifying}
        className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#d7cabd] bg-white px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#211e1a] transition hover:border-[#a98745] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isVerifying ? (
          <LoaderCircle
            size={16}
            className="animate-spin"
          />
        ) : (
          <RefreshCw size={16} />
        )}

        Verify Payment
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Payment Method Button
|--------------------------------------------------------------------------
*/

function PaymentMethodButton({
  active,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[18px] border p-4 text-left transition ${
        active
          ? "border-[#a98745] bg-[#fbf7f1] ring-1 ring-[#a98745]"
          : "border-[#e4d9cd] bg-white hover:border-[#bda889]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            active
              ? "bg-[#a98745] text-white"
              : "bg-[#f0e8df] text-[#776d62]"
          }`}
        >
          {icon}
        </span>

        <div>
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-1 text-[11px] text-[#746b62]">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Bank Transfer Form
|--------------------------------------------------------------------------
*/

function BankTransferForm({
  bankForm,
  bankDetails,
  bankDetailsReady,
  price,
  receipt,
  receiptPreview,
  formErrors,
  isSubmitting,
  success,
  onChange,
  onReceiptChange,
  onRemoveReceipt,
  onSubmit,
}) {
  if (success) {
    return (
      <div className="mt-6 rounded-[20px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <CheckCircle2 size={25} />

        <h3 className="mt-3 font-semibold">
          Payment submitted
        </h3>

        <p className="mt-2 text-xs leading-6">
          Your bank transfer is awaiting
          administrator approval. Course
          access will be activated after
          approval.
        </p>

        {success.purchaseId && (
          <p className="mt-3 break-all text-[11px]">
            Reference:{" "}
            {success.purchaseId}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-4"
    >
      <div className="rounded-[18px] border border-[#e4d9cd] bg-[#faf8f5] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a98745]">
          Receiving Account
        </p>

        {bankDetailsReady ? (
          <div className="mt-4 space-y-3 text-sm">
            <BankDetail
              label="Bank"
              value={bankDetails.bankName}
            />

            <BankDetail
              label="Account Name"
              value={
                bankDetails.accountName
              }
            />

            <BankDetail
              label="IBAN"
              value={bankDetails.iban}
            />

            <BankDetail
              label="Amount"
              value={formatPrice(price)}
            />
          </div>
        ) : (
          <p className="mt-3 text-xs leading-5 text-red-600">
            Bank account details have not
            been configured.
          </p>
        )}
      </div>

      <FormField
        label="Account Holder Name"
        name="accountHolderName"
        value={
          bankForm.accountHolderName
        }
        error={
          formErrors.accountHolderName
        }
        onChange={onChange}
        placeholder="Name on the sending account"
      />

      <FormField
        label="Sender Bank Name"
        name="bankName"
        value={bankForm.bankName}
        error={formErrors.bankName}
        onChange={onChange}
        placeholder="Your bank name"
      />

      <FormField
        label="Sender Account Number or IBAN"
        name="senderAccountNumber"
        value={
          bankForm.senderAccountNumber
        }
        error={
          formErrors.senderAccountNumber
        }
        onChange={onChange}
        placeholder="Your account number or IBAN"
      />

      <FormField
        label="Transaction Reference"
        name="transactionReference"
        value={
          bankForm.transactionReference
        }
        error={
          formErrors.transactionReference
        }
        onChange={onChange}
        placeholder="Transaction ID or reference"
      />

      <div>
        <label
          htmlFor="transferDate"
          className="mb-2 block text-xs font-semibold"
        >
          Transfer Date
        </label>

        <input
          id="transferDate"
          name="transferDate"
          type="datetime-local"
          value={bankForm.transferDate}
          onChange={onChange}
          className={`min-h-[48px] w-full rounded-xl border bg-white px-4 text-sm outline-none ${
            formErrors.transferDate
              ? "border-red-400"
              : "border-[#ddd3c7] focus:border-[#a98745]"
          }`}
        />

        {formErrors.transferDate && (
          <p className="mt-1 text-[11px] text-red-600">
            {formErrors.transferDate}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="customerNote"
          className="mb-2 block text-xs font-semibold"
        >
          Note{" "}
          <span className="font-normal text-[#8c8176]">
            (Optional)
          </span>
        </label>

        <textarea
          id="customerNote"
          name="customerNote"
          rows={3}
          maxLength={500}
          value={bankForm.customerNote}
          onChange={onChange}
          placeholder="Add an optional note"
          className="w-full resize-none rounded-xl border border-[#ddd3c7] bg-white px-4 py-3 text-sm outline-none focus:border-[#a98745]"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold">
          Payment Receipt
        </p>

        {!receipt ? (
          <label
            className={`flex cursor-pointer flex-col items-center rounded-[18px] border border-dashed bg-white px-5 py-7 text-center ${
              formErrors.receipt
                ? "border-red-400"
                : "border-[#d7cabd]"
            }`}
          >
            <Upload
              size={22}
              className="text-[#a98745]"
            />

            <p className="mt-3 text-xs font-semibold">
              Upload payment receipt
            </p>

            <p className="mt-1 text-[11px] text-[#8a8178]">
              JPG, PNG, or WEBP — maximum 5
              MB
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onReceiptChange}
              className="sr-only"
            />
          </label>
        ) : (
          <div className="relative overflow-hidden rounded-[18px] border border-[#ddd3c7] bg-white">
            <img
              src={receiptPreview}
              alt="Payment receipt"
              className="h-44 w-full object-contain"
            />

            <button
              type="button"
              onClick={onRemoveReceipt}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-2 border-t px-4 py-3">
              <FileImage
                size={16}
                className="text-[#a98745]"
              />

              <span className="truncate text-xs">
                {receipt.name}
              </span>
            </div>
          </div>
        )}

        {formErrors.receipt && (
          <p className="mt-1 text-[11px] text-red-600">
            {formErrors.receipt}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting ||
          !bankDetailsReady
        }
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#a98745] px-6 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#211e1a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && (
          <LoaderCircle
            size={17}
            className="animate-spin"
          />
        )}

        {isSubmitting
          ? "Submitting Payment"
          : "Submit Bank Transfer"}
      </button>
    </form>
  );
}

/*
|--------------------------------------------------------------------------
| Reusable Components
|--------------------------------------------------------------------------
*/

function BankDetail({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-5">
      <span className="text-[#8c8176]">
        {label}
      </span>

      <strong className="break-all text-right">
        {value}
      </strong>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  error,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`min-h-[48px] w-full rounded-xl border bg-white px-4 text-sm outline-none ${
          error
            ? "border-red-400"
            : "border-[#ddd3c7] focus:border-[#a98745]"
        }`}
      />

      {error && (
        <p className="mt-1 text-[11px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckoutLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee]">
      <LoaderCircle
        size={34}
        className="animate-spin text-[#a98745]"
      />
    </main>
  );
}

function CheckoutError({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-5">
      <div className="w-full max-w-lg rounded-[26px] border border-red-200 bg-white p-8 text-center">
        <BookOpen
          size={40}
          className="mx-auto text-red-500"
        />

        <h1 className="mt-5 text-2xl font-semibold">
          Checkout unavailable
        </h1>

        <p className="mt-3 text-sm text-red-600">
          {message}
        </p>

        <Link
          href="/courses"
          className="mt-6 inline-flex rounded-full bg-[#211e1a] px-6 py-3 text-xs font-semibold uppercase text-white"
        >
          Back to Courses
        </Link>
      </div>
    </main>
  );
}