import Container from "../container/Container"


export const Loader = () => {
    return (
        <Container>
            <div className="w-full flex justify-center">
                <div className="w-8 text-center h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        </Container>
    )
}
