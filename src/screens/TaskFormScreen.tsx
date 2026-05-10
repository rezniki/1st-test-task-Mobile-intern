import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../types/task';
import { AppColors } from '../ui/colors';
import { getDateInputMask, parseUserDateInput } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'> & {
  onCreateTask: (input: {
    title: string;
    description: string;
    address: string;
    dueDate: string;
  }) => Promise<void>;
  colors: AppColors;
};

interface TaskFormData {
  title: string;
  description: string;
  address: string;
  dueDateInput: string;
}

export const TaskFormScreen = ({ navigation, onCreateTask, colors }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      address: '',
      dueDateInput: ''
    }
  });

  const submitForm = async (data: TaskFormData) => {
    const parsedDate = parseUserDateInput(data.dueDateInput.trim());
    if (!parsedDate) {
      return;
    }

    await onCreateTask({
      title: data.title,
      description: data.description,
      address: data.address,
      dueDate: parsedDate.toISOString()
    });
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Task details</Text>

      <FormField
        name="title"
        label="Title *"
        placeholder="Install sensors in warehouse #3"
        control={control}
        colors={colors}
        errorMessage={errors.title?.message}
        rules={{ required: 'Title is required.' }}
      />

      <FormField
        name="description"
        label="Description *"
        placeholder="What should be done on-site?"
        multiline
        control={control}
        colors={colors}
        errorMessage={errors.description?.message}
        rules={{ required: 'Description is required.' }}
      />

      <FormField
        name="address"
        label="Address *"
        placeholder="221B Baker Street, London"
        control={control}
        colors={colors}
        errorMessage={errors.address?.message}
        rules={{ required: 'Address is required.' }}
      />

      <FormField
        name="dueDateInput"
        label={`Date & time * (${getDateInputMask()})`}
        placeholder="2026-05-11 09:30"
        control={control}
        colors={colors}
        errorMessage={errors.dueDateInput?.message}
        rules={{
          required: 'Date and time are required.',
          validate: (value) =>
            parseUserDateInput(value.trim()) ? true : `Use format: ${getDateInputMask()}`
        }}
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: isSubmitting ? 0.7 : 1 }]}
          onPress={handleSubmit(submitForm)}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Saving...' : 'Create task'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

interface FormFieldProps {
  name: keyof TaskFormData;
  label: string;
  placeholder: string;
  control: ReturnType<typeof useForm<TaskFormData>>['control'];
  colors: AppColors;
  errorMessage?: string;
  multiline?: boolean;
  rules: Parameters<typeof Controller<TaskFormData>>[0]['rules'];
}

const FormField = ({
  name,
  label,
  placeholder,
  control,
  colors,
  errorMessage,
  multiline = false,
  rules
}: FormFieldProps) => (
  <View style={styles.fieldBlock}>
    <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            multiline ? styles.textarea : null,
            {
              color: colors.textPrimary,
              borderColor: errorMessage ? colors.danger : colors.border,
              backgroundColor: colors.card
            }
          ]}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      )}
    />
    {errorMessage ? <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 30
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16
  },
  fieldBlock: {
    marginBottom: 14
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16
  },
  textarea: {
    minHeight: 110,
    paddingVertical: 12
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500'
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});
