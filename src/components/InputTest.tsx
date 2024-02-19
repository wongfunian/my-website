import { Button } from '@nextui-org/react';
import { useFormikContext } from 'formik';

const InputTest: React.FC = () => {
    const formikContext = useFormikContext();

    const setDefaultValue = () => {
        formikContext.setValues({
            name: 'Hello world 2',
        });
    };

    return (
        <div>
            <Button onClick={setDefaultValue}>Click me</Button>
        </div>
    );
};

export default InputTest;
