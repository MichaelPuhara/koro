import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';

type Props = {
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

function Title({ setMessages }: Props) {
    const [isResetting, setIsResetting] = useState(false);

    // Reset the conversation
    const resetConversation = async () => {
        setIsResetting(true);

        try {
            // Update this URL to your backend URL when deploying
            const response = await axios.get("http://localhost:8000/reset");
            if (response.status === 200) {
                setMessages([]);
                Alert.alert("Success", "Conversation reset successful!");
            } else {
                console.error("There was an error with the API to backend");
            }
        } catch (err: any) {
            console.error("Error in resetting conversation:", err.message);
            Alert.alert("Error", "Failed to reset conversation");
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>rachel</Text>
            <TouchableOpacity
                onPress={resetConversation}
                disabled={isResetting}
                style={styles.button}
            >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={isResetting ? "#f9a8d4" : "#93c5fd"} strokeWidth={1.5}>
                    <Path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </Svg>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 16,
        backgroundColor: '#111827',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 18,
    },
    button: {
        padding: 4,
    },
});

export default Title;
