import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import TshirtBranding from "@/components/TshirtBranding";
import CategorySection from "@/components/CategorySection";

export default function Home() {
    return (
        <div>
            <Hero />
            <CategorySection />
            <LatestProducts />
            <BestSelling />
            <TshirtBranding />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
