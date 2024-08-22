import { Button, Container, Divider, Stack, TextField } from '@mui/material';
import { useBooleanController, useGlobalBoolean, useWatchBoolean } from 'use-global-boolean';

const Form1 = () => {
    const [show] = useBooleanController('form1');

    return (
        show && (
            <>
                <h2>Form1</h2>
                <form>
                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                        <TextField type="text" variant="outlined" color="secondary" label="Field 1" fullWidth required />
                        <TextField type="text" variant="outlined" color="secondary" label="Field 2" fullWidth required />
                    </Stack>
                    <TextField type="email" variant="outlined" color="secondary" label="Field 3" fullWidth required sx={{ mb: 4 }} />
                </form>
            </>
        )
    );
};

const Form2 = () => {
    const [show] = useBooleanController('form2');

    return (
        show && (
            <>
                <h2>Form2</h2>
                <form>
                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                        <TextField type="email" variant="outlined" color="secondary" label="Field 3" required sx={{ mb: 4 }} />
                        <TextField type="text" variant="outlined" color="secondary" label="Field 1" fullWidth required />
                        <TextField type="text" variant="outlined" color="secondary" label="Field 2" required />
                    </Stack>
                </form>
            </>
        )
    );
};

const Form3 = () => {
    const [show] = useBooleanController('form3');

    return (
        show && (
            <>
                <h2>Form3</h2>
                <form>
                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                        <TextField type="text" variant="outlined" color="secondary" label="Field 1" fullWidth required />
                        <TextField type="text" variant="outlined" color="secondary" label="Field 2" fullWidth required />
                    </Stack>
                    <TextField type="email" variant="outlined" color="secondary" label="Field 3" fullWidth required sx={{ mb: 4 }} />
                </form>
            </>
        )
    );
};

const Form4 = () => {
    const [show] = useBooleanController('form4');

    return (
        show && (
            <>
                <h2>Form4</h2>
                <form>
                    <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                        <TextField type="text" variant="outlined" color="secondary" label="Field 1" fullWidth required />
                        <TextField type="email" variant="outlined" color="secondary" label="Field 3" required sx={{ mb: 4 }} />
                        <TextField type="text" variant="outlined" color="secondary" label="Field 2" required />
                    </Stack>
                </form>
            </>
        )
    );
};

const ButtonShowForm4 = () => {
    const { setTrue } = useGlobalBoolean();
    const [showForm3] = useWatchBoolean('form3');
    return (
        <Button disabled={!showForm3} variant="outlined" onClick={() => setTrue('form4')}>
            Show form 4
        </Button>
    );
};

const ButtonShowForm3 = () => {
    const { setTrue } = useGlobalBoolean();
    const [showForm2] = useWatchBoolean('form2');

    return (
        <Button disabled={!showForm2} variant="outlined" onClick={() => setTrue('form3')}>
            Show form 3
        </Button>
    );
};

const ButtonShowForm2 = () => {
    const { setTrue } = useGlobalBoolean();
    const [showForm1] = useWatchBoolean('form1');

    return (
        <Button disabled={!showForm1} variant="outlined" onClick={() => setTrue('form2')}>
            Show form 2
        </Button>
    );
};

const ButtonShowForm1 = () => {
    const { setTrue } = useGlobalBoolean();
    const [buttonUndisabled] = useWatchBoolean('enable show form 1');

    return (
        <Button variant="outlined" disabled={!buttonUndisabled} onClick={() => setTrue('form1')}>
            Show form 1
        </Button>
    );
};

const ButtonUnDisabled = () => {
    const [show, { setTrue }] = useBooleanController('enable show form 1');

    return (
        !show && (
            <Button variant="outlined" fullWidth color="success" onClick={() => setTrue()}>
                Enable show form 1
            </Button>
        )
    );
};

const Header = () => {
    return (
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <ButtonShowForm1 />
            <ButtonShowForm2 />
            <ButtonShowForm3 />
            <ButtonShowForm4 />
        </Stack>
    );
};

const DynamicDisplayOfForms = () => {
    return (
        <Container maxWidth="xs">
            <Header />
            <Divider sx={{ my: '30px' }} />

            <ButtonUnDisabled />

            <Form1 />
            <Form2 />
            <Form3 />
            <Form4 />
        </Container>
    );
};

export default DynamicDisplayOfForms;
