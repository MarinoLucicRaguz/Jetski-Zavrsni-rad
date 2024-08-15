"use client";

import { useRouter } from "next/navigation";

interface CreateReservationOptionButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

export const CreateReservationOptionButton = ({ children, mode = "redirect", asChild }: CreateReservationOptionButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/rentaloptions/createrentaloption");
    };

    if (mode === "modal") {
        return <span>TODO: Implement modal</span>;
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};
