import { Formik } from "formik";
import React from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import EmptyState from "../../../components/ui/EmptyState";
import FlowButton from "../../../components/ui/FlowButton";
import { useNavigation } from "../../../hooks";
import { lightTheme } from "../../../theme";
import DisplayElement from "./elements/DisplayElement";
import DocumentPickerElement from "./elements/DocumentPickerElement";
import LinkElement from "./elements/LinkElement";
import TextInputElement from "./elements/TextInputElement";
import TouchSelectElement from "./elements/TouchSelectElement";
import ErrorState from "../../../components/ui/ErrorState";
import { FlowProvider, FlowStore } from "../../../store/flowStore";
import { observer } from "mobx-react-lite";
import { ElementType } from "../../../store/models";
import { SafeAreaView } from "react-native-safe-area-context";
import PageTitle from "../../../components/ui/PageTitle";
interface Props {}
const ProcessBuilder: React.FC<Props> = (props) => {
  const flowStore = new FlowStore();
  const { getParam, goBack, navigate } = useNavigation();
  const instanceID = getParam("instanceID");
  useEffect(() => {
    if (instanceID)
      flowStore.onFlowInit(true, { instanceID: instanceID, values: {} });
  }, [instanceID]);
  const backFlow = (id: number, screen?: string) => {
    flowStore.onFlowBackAction(id);
  };
  const initValues = (elements: ElementType[]) => {
    var obj = Object.fromEntries(
      elements !== null && elements !== undefined
        ? elements.map((e) => {
            return [e.data.outputKey, ""];
          })
        : []
    );
    delete obj["undefined"];
    delete obj["/"];
    return obj ? obj : {};
  };
  const handleSubmit = () => {
    console.log("here");
  };
  const navigateBack = () => {
    goBack(null);
  };

  const FlowObserverView = observer(() => {
    return (
      <View
        style={
          (flowStore.isLoading && flowStore.error === null) ||
          !flowStore.flow?.elements
            ? styles.containerCenter
            : styles.containerNormal
        }
      >
        {flowStore.isLoading && (
          <ActivityIndicator
            size="large"
            color={lightTheme.PRIMARY_BUTTON_COLOR}
            style={styles.loader}
          />
        )}

        {!flowStore.isLoading &&
          flowStore.error === null &&
          flowStore.flow &&
          !flowStore.flow?.elements && (
            <EmptyState
              message="Oops! the flow seems to be empty. Please go back and try again"
              onPress={() => {
                flowStore.flow != null ? backFlow(flowStore.flow.ID) : null;
              }}
            />
          )}
        {!flowStore.isLoading && flowStore.error !== null && (
          <ErrorState
            message={flowStore.error}
            onPress={() => navigateBack()}
          />
        )}
        {!flowStore.isLoading &&
          flowStore.error === null &&
          flowStore.flow !== null &&
          flowStore.flow?.elements && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Formik
                initialValues={initValues(flowStore.flow?.elements)}
                onSubmit={(values) => {
                  flowStore.onFlowInit(false, {
                    id: flowStore?.flow?.ID,
                    values: values,
                  });
                }}
              >
                {({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  isValid,
                  handleSubmit,
                }) => (
                  <View>
                    {flowStore.flow?.elements &&
                      flowStore.flow?.elements.length > 0 &&
                      flowStore.flow?.elements.map(function (d, i) {
                        if (d.type === "display") {
                          return d?.data?.text ? (
                            <DisplayElement key={i} text={d?.data.text} />
                          ) : null;
                        } else if (d.type === "select") {
                          return (
                            <TouchSelectElement
                              key={i}
                              directSelect={true}
                              onPress={(v: any) => {
                                var obj: any = {};
                                obj[d.data.outputKey] = v;

                                flowStore.onFlowInit(false, {
                                  id: flowStore?.flow?.ID,
                                  values: obj,
                                });
                              }}
                              onValueChange={(v: any) => {
                                values[d.data.outputKey] = v;
                              }}
                              list={d?.data.list}
                            />
                          );
                        } else if (d.type === "file") {
                          return <DocumentPickerElement key={i} />;
                        } else if (d.type === "input") {
                          return (
                            <View key={i}>
                              <TextInputElement
                                inputProps={d.data}
                                onChangeText={(value: any) => {
                                  values[d.data.outputKey] = value;
                                }}
                              />
                              <FlowButton
                                disabled={false}
                                type={"primary"}
                                onPress={() => handleSubmit()}
                                label="Next"
                              />
                            </View>
                          );
                        } else if (d.type === "link") {
                          return <LinkElement key={i} linkProps={d.data} />;
                        } else {
                          return <Text key={i}>Element Type not found</Text>;
                        }
                      })}
                    {/* {flowStore?.flow?.elements &&
                                         <FlowButton disabled={false} type={'primary'} onPress={() => handleSubmit()} label="Next" />
                                     } */}

                    <FlowButton
                      disabled={false}
                      type={"secondary"}
                      onPress={() =>
                        flowStore.flow != null
                          ? backFlow(flowStore.flow.ID)
                          : null
                      }
                      label="Back"
                    />
                  </View>
                )}
              </Formik>
            </ScrollView>
          )}
      </View>
    );
  });
  return (
    <FlowProvider store={flowStore}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <PageTitle
          label="FLOW"
          leftIconName="chevron-left"
          onPress={() =>
            flowStore.flow != null && flowStore.flow.status.backEnabled
              ? backFlow(flowStore.flow.ID)
              : navigateBack()
          }
        />
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <FlowObserverView />
      </SafeAreaView>
    </FlowProvider>
  );
};
ProcessBuilder.defaultProps = {};
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 9 : 10,
    paddingBottom: 50,
  },
  containerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  containerNormal: {
    padding: 20,
  },
  loader: {
    marginTop: 200,
    justifyContent: "center",
  },
});
export default ProcessBuilder;
