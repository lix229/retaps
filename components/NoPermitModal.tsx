import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface NoPermitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function NoPermitModal({ isOpen, onClose, onContinue }: NoPermitModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">No Permit Selected</ModalHeader>
                <ModalBody>
                    <p>
                        You haven't selected any parking permits. This will show all available parking spots that{' '}
                        <span className="font-bold text-danger">do not require a permit</span>, which might be none.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Go Back
                    </Button>
                    <Button color="primary" onPress={onContinue}>
                        Continue Anyway
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}