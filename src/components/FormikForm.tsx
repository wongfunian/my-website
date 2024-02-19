import { PropsWithChildren } from 'react';
import { Form, Formik, FormikHelpers, FormikValues, useFormik } from 'formik';

export type FormInstance<T extends FormikValues> = ReturnType<typeof useFormik<T>>;

interface FormProps<T extends FormikValues> extends PropsWithChildren {
    form: FormInstance<T>;
    onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
}

const FormikForm = <T extends FormikValues>(props: FormProps<T>) => {
    const { form, onSubmit, children } = props;

    return (
        <Formik {...form} onSubmit={onSubmit}>
            <Form onSubmit={form.handleSubmit}>{children}</Form>
        </Formik>
    );
};

export default FormikForm;
