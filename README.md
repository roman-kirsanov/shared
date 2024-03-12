## Usage

```typescript
import { createShared, useShared } from 'shared'

const firstNameShared = createShared<string>('');
const lastNameShared = createShared<string>('');
const disabledShared = createShared<boolean>(false);
const errorShared = createShared<string | null>(null);

const saveData = async () => {
    disabledShared.set(true);
    errorShared.set(null);
    try {
        await post('/api/data', {
            firstName: firstNameShared.get(),
            lastName: lastNameShared.get()
        });
    } catch (e) {
        errorShared.set(e.message);
    } finally {
        disabledShared.set(false);
    }
}

const FirstName = () => {
    const [ firstName, setFirstName ] = useShared(firstNameShared);
    const [ disabled ] = useShared(disabledShared);
    return (
        <Input disabled={disabled} value={firstName} onChange={setFirstName} />
    )
}

const LastName = () => {
    const [ lastName, setLastName ] = useShared(lastNameShared);
    const [ disabled ] = useShared(disabledShared);
    return (
        <Input disabled={disabled} value={lastName} onChange={setLastName} />
    )
}

const Save = () => {
    const [ disabled ] = useShared(disabledShared);
    const [ error ] = useShared(errorShared);
    return (
        <div>
            {error}
            <Button disabled={disabled} onClick={saveData}>
                Save
            </Button>
        </div>
    )
}

export default () => {
    return (
        <div>
            <FirstName />
            <LastName />
            <Save />
        </div>
    )
}
```
