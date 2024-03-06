package no.kristiania.kws2100.elveg;

import org.eaxy.Element;
import org.eaxy.ElementSet;

public class ElvegProcessors {

    abstract static class AbstractElvegProcessor implements ElementProcessor {
        protected String textOrNull(ElementSet elementSet) {
            return elementSet.isPresent() ? elementSet.first().text() : null;
        }
    }


    static class VeglenkeProcessor extends AbstractElvegProcessor {
        @Override
        public void process(Element element) {
            var veglenke = new Elveg.Veglenke()
                    .setDetaljnivå(textOrNull(element.find("detaljnivå")))
                    .setTypeVeg(element.find("typeVeg").first().text())
                    .setFeltoversikt(textOrNull(element.find("feltoversikt")))
                    .setKonnekteringslenke("true".equals(element.find("konnekteringslenke").first().text()))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
            veglenke.getTypeVeg();
        }
    }

    public static class FartsgrenseProcessor extends AbstractElvegProcessor {
        @Override
        public void process(Element element) {
            var fartsgrense = new Elveg.Fartsgrense()
                    .setId(element.attr(Gml.GML.name("id")))
                    .setFartsgrenseVerdi(textOrNull(element.find("fartgrenseVerdi")))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }
}
