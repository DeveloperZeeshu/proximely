import type { ReactNode } from "react"

interface ContainerProps {
    children: ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="
      w-full
      mx-auto
      px-3 lg:px-6
      pt-18 pb-12
      max-w-7xl
    ">
      {children}
    </div>
  );
};

export default Container
