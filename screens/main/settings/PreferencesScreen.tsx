import { ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import SwitchItem from './components/SwitchItem'
import { globalStyles } from '../../../constants/globalStyles'
import { spacing } from '../../../constants/spacing'
import GoBackHeaderComponent from '../../../components/GoBackHeaderComponent'

const PreferencesScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    const renderPreferencesSection = () => {
        return (
            <View style={{ gap: spacing.sm }}>
                <SwitchItem
                    title="Notifications"
                    description="Receive notifications for new updates and important information"
                    icon="bell"
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                />
            </View>
        )
    }
  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={false}
      style={{
        ...globalStyles.container,
      }}
    >
        <GoBackHeaderComponent title="Preferences" />
      {renderPreferencesSection()}
    </ScrollView>
  )
}

export default PreferencesScreen